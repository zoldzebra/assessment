export interface Todo extends NewTodo {
  id: string,
  doneTimestamp?: number,
};

export interface UpdateTodo extends NewTodo {
  text?: string,
}
export interface NewTodo {
  text: string,
  priority?: number,
  done?: boolean,
};