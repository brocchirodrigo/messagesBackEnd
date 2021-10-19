/**
 *  - Especificação Funcional -
 * 1. [Fluxo Principal] Receber o code(string)
 * 2. [Fluxo Principal] Recuperar o access_token do Github
 * 3. [Fluxo Principal] Verificar se o usuário existe no nosso banco de dados
 * 4. [Fluxo Principal] Se existir no banco de dados, gerar token
 * 5. [Fluxo Intermediário] Se não existir, criar no banco de dados
 * 6. [Fluxo Principal] Recuperar infos do user no Github 
 * 7. [Fluxo Principal] Após criar o novo ou identificar o usuário, gerar o token do usuário logado.
 */

import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserData {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
  email: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }, 
      headers: {
        'Accept': 'application/json',
      }
    })

    const response = await axios.get<IUserData>(
      'https://api.github.com/user', {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`
        }
      }
    );

    const { login, id, avatar_url, name, email } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
          email
        }
      })
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,          
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    )

    return { token, user };
  }
}

export { AuthenticateUserService };
