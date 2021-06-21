import fs from 'fs';

export class TodoService {
  todos: string;
  dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.todos = '';
  }

  getAllTodos() {
    const buffer = fs.readFileSync(this.dbPath, 'utf8');
    const rawTodos = JSON.parse(buffer);
    this.todos = rawTodos;
    return this.todos;
  }
}