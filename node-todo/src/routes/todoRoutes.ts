import { Router } from 'express';

import { NewTodo, Todo } from '../model/todo';
import { TodoService } from '../services/todoService';
import { isNewTodoValid, isUpdateTodoValid } from '../model/validate';

export const todoRouter = Router();
const todoService = new TodoService();

todoRouter.get('/', (req, res) => {
	const todos = todoService.getAllTodos();
	return res.json(todos);
});

todoRouter.post('/', (req, res) => {
  const newTodo = req.body;

  if (!isNewTodoValid(newTodo)) {
    return res.status(400).json({
      status: 400, 
      message: 'Invalid JSON input.'
    });
  }

  try {
    const savedTodo: Todo =  todoService.saveTodo(newTodo);
    return res.json(savedTodo);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: `Internal server error: ${err.message}`
    })
  }
});

todoRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const todo = todoService.getTodo(id);
  if (!todo) {
    return res.sendStatus(404);
  }
  return res.json(todo);
});

todoRouter.put('/:id', (req, res) => {
  const id = req.params.id;
  const updateInput = req.body;

  if (!isUpdateTodoValid(updateInput)) {
    return res.status(400).json({
      status: 400, 
      message: 'Invalid JSON input.'
    });
  }

  try {
    const updatedTodo =  todoService.updateTodo(id, updateInput);
    if (!updatedTodo) {
      return res.sendStatus(404);
    }
    return res.json(updatedTodo);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: `Internal server error: ${err.message}`
    })
  }
});

todoRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  const result = todoService.deleteTodo(id);
  if (!result) {
    return res.sendStatus(404);
  }
  return res.json(result);
});