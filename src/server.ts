import {serverHttp, port} from './app';


serverHttp.listen(port, () => {console.log(`Server is running in port ${port}`)})