import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { Todo, NewTodo, UpdateTodo } from '../model/todo';
import { dbPathByEnv } from '../dbPathByEnv';

export class TodoService {
  private readonly DEFAULT_PRIORITY = 3;
  private readonly DEFAULT_DONE = false;
  private readonly EXPIRATION_SECS = 5 * 60;
  private readonly EXPIRATION_CHECK_SECS = 1 * 60;

  dbPath: string;

  constructor() {
    this.dbPath = dbPathByEnv();
    this.deleteExpiredDoneTodosJob();
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
      doneTimestamp: newTodo.done ? this.getDateNowSecs() : undefined,
      ...newTodo,
    };

    allTodos = [...allTodos, todo];
    fs.writeFileSync(this.dbPath, JSON.stringify(allTodos));

    return todo;
  }

  getTodo(id: string): Todo | null {
    const allTodos = this.getAllTodos();
    const todo = allTodos.find(todo => todo.id === id);
    return todo || null;
  }

  updateTodo(id: string, updateInput: UpdateTodo): Todo | null {
    const allTodos = this.getAllTodos();
    const todo = allTodos.find(todo => todo.id === id);
    if (!todo) {
      return null;
    }
    this.handleDoneTimestamp(todo, updateInput);
    const updatedTodo: Todo = Object.assign(todo, updateInput);

    const updatedAllTodos = allTodos.map(todo => {
      if (todo.id === id) {
        return updatedTodo;
      } else {
        return todo;
      }
    });
    fs.writeFileSync(this.dbPath, JSON.stringify(updatedAllTodos));
    return updatedTodo;
  }

  deleteTodo(id: string): string | null {
    const allTodos = this.getAllTodos();
    const todo = allTodos.find(todo => todo.id === id);
    if (!todo) {
      return null;
    }
    const allTodosWithoutDeleted = allTodos
      .filter(todo => todo.id !== id);
    fs.writeFileSync(this.dbPath, JSON.stringify(allTodosWithoutDeleted));
    return id;
  }

  deleteExpiredDoneTodosJob() {
    const job = setInterval(() => {
      this.deleteExpiredTodos();
    }, this.EXPIRATION_CHECK_SECS * 1000);
    job.unref();
  }

  deleteExpiredTodos = () => {
    const allTodos = this.getAllTodos();
    const timeNowSecs = this.getDateNowSecs();
    const expiredTodos = allTodos.filter(todo => {
      if (todo.done && todo.doneTimestamp) {
        return (todo.doneTimestamp + this.EXPIRATION_SECS) < timeNowSecs;
      }
    });
    if (expiredTodos.length) {
      expiredTodos.forEach(expiredTodo => {
        this.deleteTodo(expiredTodo.id);
      });
    }
  }

  private handleDoneTimestamp(todo: Todo, updateInput: UpdateTodo) {
    if (updateInput.done && !todo.done) {
      todo.doneTimestamp = this.getDateNowSecs();
    }
    if (updateInput.done === false && todo.done) {
      todo.doneTimestamp = undefined;
    }
  }

  private getDateNowSecs(): number {
    return Math.round(Date.now() / 1000);
  }
}