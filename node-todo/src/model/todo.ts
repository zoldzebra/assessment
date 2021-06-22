export interface Todo extends NewTodo {
  id: string,
};

export interface NewTodo {
  text: string,
  priority?: number,
  done?: boolean,
};