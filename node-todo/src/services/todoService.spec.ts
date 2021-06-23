import fs from 'fs';

import { NewTodo, UpdateTodo, Todo } from '../model/todo';
import { TodoService } from './todoService';
import { dbPathByEnv } from '../dbPathByEnv';

const TODO_1: Todo = {
	'id': '1',
	'text': 'Test todo 1',
	'priority': 2,
	'done': false
};
const TODO_2: Todo = {
	'id': '2',
	'text': 'Test todo 2',
	'priority': 3,
	'done': false
};
const NEW_TODO: NewTodo = {
  'text': 'New TODO',
	'priority': 3,
	'done': false
}

const testDBPath = dbPathByEnv();

describe('TodoService', () => {
  afterAll(() => {
    purgeTestDb();
  });

  describe('getAllTodos', () => {
    beforeEach (() => {
      purgeTestDb();
    });

    it('should return empty array if db is empty', () => {
      const todoService = new TodoService();

      const results = todoService.getAllTodos();

      expect(results).toStrictEqual([]);
    });

		it('should return all todos from db', () => {
      const todoService = new TodoService();
      const todos = [TODO_1, TODO_2];
      writeToDb(todos);

			const results = todoService.getAllTodos();

			expect(results).toEqual(expect.arrayContaining(todos));
		});
	});

  describe('saveTodo', () => {
    beforeEach (() => {
      jest.restoreAllMocks();
      purgeTestDb();
    });

    it('should save new todo into db', () => {
      const todoService = new TodoService();

      todoService.saveTodo(NEW_TODO);

      const dbTodos = readFromDb();
      
      expect(dbTodos.length).toEqual(1);
    });

    it('should return the saved todo with id field', () => {
      const todoService = new TodoService();
      const expectedTodoFields = {
        text: 'New TODO',
        priority: 3,
        done: false,
      };

      const retVal = todoService.saveTodo(NEW_TODO);

      expect(retVal).toMatchObject(expectedTodoFields);
      expect(retVal).toHaveProperty('id');
    });

    it('should append default values for priority and done if not given', () => {
      const todoService = new TodoService();
      const noPrioNewTodo: NewTodo = {
        text: 'I have no prio nor done',
      };
      const expectedTodoFields = {
        priority: 3,
        ...noPrioNewTodo,
      };

      const retVal = todoService.saveTodo(noPrioNewTodo);

      expect(retVal).toHaveProperty('priority', 3);
      expect(retVal).toHaveProperty('done', false);
    });

    it('should add doneTimestamp only if todo is saved as done', () => {
      const todoService = new TodoService();
      const doneTodo: NewTodo = {
        text: 'I am so done',
        done: true,
      };
      const undoneTodo: NewTodo = {
        text: 'I am so undone',
        done: false,
      };
      jest.spyOn(Date, 'now').mockImplementation(() => {
        return 12345678000;
      });

      const doneResult = todoService.saveTodo(doneTodo);
      const undoneResult = todoService.saveTodo(undoneTodo);

      expect(doneResult).toHaveProperty('doneTimestamp', 12345678);
      expect(undoneResult).toHaveProperty('doneTimestamp', undefined);
    })
  });

  describe('getTodo', () => {
    beforeEach (() => {
      purgeTestDb();
    });
    it('should return todo by id', () => {
      const todoService = new TodoService();
      writeToDb([TODO_1]);

      const result = todoService.getTodo(TODO_1.id);

      expect(result).toStrictEqual(TODO_1);
    });

    it('should return null if id not found', () => {
      const todoService = new TodoService();

      const result = todoService.getTodo(TODO_1.id);

      expect(result).toBeNull;
    });
  });

  describe('updateTodo', () => {
    beforeEach (() => {
      jest.restoreAllMocks();
      purgeTestDb();
    });

    it('should save the updated todo into the db', () => {
      const todoService = new TodoService();
      const updateInput: UpdateTodo = {
        text: 'Updated text here'
      };
      const updatedTodo: Todo = {
        id: '1',
        text: 'Updated text here',
        priority: 2,
        done: false
      };
      writeToDb([TODO_1]);

      todoService.updateTodo(TODO_1.id, updateInput);

      const dbTodos = readFromDb();

      expect(dbTodos[0]).toEqual(updatedTodo);
    });

    it('should return the updated todo', () => {
      const todoService = new TodoService();
      const updateInput: UpdateTodo = {
        text: 'Updated text here'
      };
      const updatedTodo: Todo = {
        id: '1',
        text: 'Updated text here',
        priority: 2,
        done: false
      };
      writeToDb([TODO_1]);
      
      const result = todoService.updateTodo(TODO_1.id, updateInput);

      expect(result).toEqual(updatedTodo);
    });

    it('should return null if todo not found', () => {
      const todoService = new TodoService();
      
      const result = todoService.updateTodo('dummiId', {} as NewTodo);

      expect(result).toBeNull;
    });

    it('should add doneTimeStamp to todo if its updated to done', () => {
      const todoService = new TodoService();
      const updateInput: UpdateTodo = {
        done: true,
      };
      writeToDb([TODO_1])
      jest.spyOn(Date, 'now').mockImplementation(() => {
        return 12345678000;
      });
      
      const result = todoService.updateTodo(TODO_1.id, updateInput);

      expect(result).toHaveProperty('doneTimestamp', 12345678);
    });

    it('should remove doneTimeStamp if todo switched from done to undone', () => {
      const todoService = new TodoService();
      const doneTodo: Todo = {
        id: '123abc',
        text: 'done todo',
        priority: 3,
        done: true,
        doneTimestamp: 1234,
      }
      const updateInput: UpdateTodo = {
        done: false,
      };
      writeToDb([doneTodo]);

      const result = todoService.updateTodo(doneTodo.id, updateInput);

      expect(result).toHaveProperty('doneTimestamp', undefined);
    })
  });

  describe('deleteTodo', () => {
    beforeEach (() => {
      purgeTestDb();
    });

    it('should delete todo by id', () => {
      const todoService = new TodoService();
      const todos = [TODO_1, TODO_2];
      writeToDb(todos);

      todoService.deleteTodo(TODO_1.id);

      const dbTodos = readFromDb()

      expect(dbTodos.length).toBe(1);
      expect(dbTodos[0]).toEqual(TODO_2);
    });

    it('should return id if delete successful', () => {
      const todoService = new TodoService();
      writeToDb([TODO_1]);

      const result = todoService.deleteTodo(TODO_1.id);

      expect(result).toBe(TODO_1.id);
    });

    it('should return null if todo not found', () => {
      const todoService = new TodoService();
      writeToDb([TODO_1]);

      const result = todoService.deleteTodo('badId');

      expect(result).toBeNull;
    })
  });

  describe('deleteExpiredDoneTodosJob', () => {
    beforeEach (() => {
      jest.restoreAllMocks();
      purgeTestDb();
    });
    
    it('should delete only expired todos', () => {
      const todoService = new TodoService();
      jest.useFakeTimers();
      const doneTodo1: Todo = {
        id: '123abc',
        text: 'done todo',
        priority: 3,
        done: true,
        doneTimestamp: 1234,
      }
      const doneTodo2: Todo = {
        id: '123abc123',
        text: 'done todo2',
        priority: 3,
        done: true,
        doneTimestamp: 1234,
      }
      const doneInTheFuture: Todo = {
        id: '123abc123asd',
        text: 'done todo2',
        priority: 3,
        done: true,
        doneTimestamp: Date.now(),
      }
      const undoneTodo: Todo = {
        id: '123abc123asd',
        text: 'done todo2',
        priority: 3,
        done: false,
      }
      const todos = [doneTodo1, doneTodo2, doneInTheFuture, undoneTodo];
      writeToDb(todos);

      todoService.deleteExpiredDoneTodosJob(1, 2);
      jest.advanceTimersToNextTimer();

      const dbTodos = readFromDb();
      expect(dbTodos.length).toBe(2);
      expect(dbTodos[0]).toEqual(doneInTheFuture);
      expect(dbTodos[1]).toEqual(undoneTodo);
      jest.clearAllTimers();
    });
  });

});

const purgeTestDb = () => {
	fs.writeFileSync(testDBPath, JSON.stringify([]));
};

const writeToDb = (todos: Todo[]) => {
  fs.writeFileSync(testDBPath, JSON.stringify(todos));
}

const readFromDb = (): Todo[] => {
  const buffer = fs.readFileSync(testDBPath, 'utf8');
  const dbTodos: Todo[] = JSON.parse(buffer);
  return dbTodos;
}
