import express from 'express';
import * as bodyParser from 'body-parser';

import { todoRouter } from './routes/todoRoutes';

const app = express();
app.use(bodyParser.json());
app.use('/todos', todoRouter);

export { app };
