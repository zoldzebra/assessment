import { Router } from 'express';

import { NewTodo, Todo } from '../model/todo';
import { TodoService } from '../services/todoService';
import { isNewTodoValid } from '../model/validate';

export const todoRouter = Router();
const todoService = new TodoService();

todoRouter.get('/', (req, res) => res.send('Hello World!'));

todoRouter.get('/todos', (req, res) => {
	const todos = todoService.getAllTodos();
	return res.json(todos);
});

todoRouter.post('/todos', (req, res) => {
  const newTodo = req.body;

  if (isNewTodoValid(newTodo)) {
    try {
      const savedTodo: Todo =  todoService.saveTodo(newTodo); 
      return res.json(savedTodo);
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: `Internal server error: ${err.message}`
      })
    }
  } else {
    return res.status(400).json({
      status: 400, 
      message: 'Invalid JSON input.'
    });
  }
});