import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './routes';

dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

app.use(
   cors({
      origin: allowedOrigins,
      credentials: true,
   })
);
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () =>
   console.log('aiproject router started listening on port: ', port)
);
