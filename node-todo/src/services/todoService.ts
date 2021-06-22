import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { Todo, NewTodo } from '../model/todo';
import { dbPathByEnv } from '../dbPathByEnv';

export class TodoService {
  private readonly DEFAULT_PRIORITY = 3;
  private readonly DEFAULT_DONE = false;

  todos: Todo[] | [];
  dbPath: string;

  constructor() {
    this.dbPath = dbPathByEnv();
    const buffer = fs.readFileSync(this.dbPath, 'utf8');
    const rawTodos = JSON.parse(buffer);
    this.todos = rawTodos;
  }

  getAllTodos(): Todo[] {
    return this.todos;
  }

  saveTodo(newTodo: NewTodo): Todo {
    const todo: Todo = {
      id: uuidv4(),
      priority: newTodo.priority || this.DEFAULT_PRIORITY,
      done: newTodo.done || this.DEFAULT_DONE,
      ...newTodo,
    };
    this.todos = [...this.todos, todo];
    fs.writeFileSync(this.dbPath, JSON.stringify(this.todos));
    return todo;
  }
}