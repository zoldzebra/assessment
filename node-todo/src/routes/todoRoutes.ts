import { Router } from 'express';
import { TodoService } from '../services/todoService';

export const todoRouter = Router();
const todoService = new TodoService('./db/prodDb.json');

todoRouter.get('/', (req, res) => res.send('Hello World!'));

todoRouter.get('/todos', (req, res) => {
	const todos = todoService.getAllTodos();
	return res.status(200).send(todos);
});