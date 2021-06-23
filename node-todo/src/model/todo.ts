export interface Todo extends NewTodo {
  id: string,
  doneTimeStamp?: number,
};

export interface UpdateTodo extends NewTodo {
  text?: string,
}
export interface NewTodo {
  text: string,
  priority?: number,
  done?: boolean,
};