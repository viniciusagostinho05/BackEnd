import 'dotenv/config';
import express, { RequestHandler } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRouter from './api/routes';
import './api/utils/auth/auth-handlers';
import { authMiddleware } from './api/auth/auth.middleware';
import authRouter from './api/auth/auth.router';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/api', authRouter)
app.use('/api', authMiddleware as RequestHandler);
app.use('/api', apiRouter); 


export default app;