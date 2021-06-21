import fs from 'fs';

import { dbPathByEnv } from '../dbPathByEnv';

export class TodoService {
  todos: string;
  dbPath: string;

  constructor() {
    this.dbPath = dbPathByEnv();
    this.todos = '';
  }

  getAllTodos() {
    const buffer = fs.readFileSync(this.dbPath, 'utf8');
    const rawTodos = JSON.parse(buffer);
    this.todos = rawTodos;
    return this.todos;
  }
}