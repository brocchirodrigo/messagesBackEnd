import "dotenv/config";
import express, { response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { router } from './routes';

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado no Socket ${socket.id}`);
});

app.use(express.json());

app.use(router);

app.get('/', (req, res) => {
  res.json({
    developer: "Rodrigo Mendes Brocchi",
    Github: "https://github.com/brocchirodrigo",
    details: {
      Project: "Do While2021",
      Licence: "MIT",
      Comment: "Originado a partir do NLW Heat em 2021, e que foi proposto pela RocketSeat",
      Repository: "https://github.com/brocchirodrigo/messagesBackEnd"
    }
  })
})

app.get("/github", (request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

app.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  response.json(code)
});

export { serverHttp, io, port };