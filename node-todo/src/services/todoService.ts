import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { Todo, NewTodo } from '../model/todo';
import { dbPathByEnv } from '../dbPathByEnv';

export class TodoService {
  private readonly DEFAULT_PRIORITY = 3;
  private readonly DEFAULT_DONE = false;

  dbPath: string;

  constructor() {
    this.dbPath = dbPathByEnv();
  }

  getAllTodos(): Todo[] {
    const buffer = fs.readFileSync(this.dbPath, 'utf8');
    const allTodos: Todo[] = JSON.parse(buffer);
  
    return allTodos;
  }

  saveTodo(newTodo: NewTodo): Todo {
    let allTodos = this.getAllTodos();
    const todo: Todo = {
      id: uuidv4(),
      priority: newTodo.priority || this.DEFAULT_PRIORITY,
      done: newTodo.done || this.DEFAULT_DONE,
      ...newTodo,
    };

    allTodos = [...allTodos, todo];
    fs.writeFileSync(this.dbPath, JSON.stringify(allTodos));

    return todo;
  }

  getTodo(id: string): Todo | null {
    let allTodos = this.getAllTodos();
    const todo = allTodos.find(todo => todo.id === id);
    return todo || null;
  }
}