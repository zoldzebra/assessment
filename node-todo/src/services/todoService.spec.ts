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
  });

  describe('getTodo', () => {
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
      writeToDb([TODO_1]);

      todoService.updateTodo(TODO_1.id, updateInput);

      const dbTodos = readFromDb();
      expect(dbTodos[0]).toHaveProperty('doneTimeStamp');
    });

    it('should remove doneTimeStamp if todo switched from done to undone', () => {
      const todoService = new TodoService();
      const doneTodo: Todo = {
        id: '123abc',
        text: 'done todo',
        priority: 3,
        done: true,
        doneTimeStamp: 1234,
      }
      const updateInput: UpdateTodo = {
        done: false,
      };
      writeToDb([doneTodo]);

      todoService.updateTodo(doneTodo.id, updateInput);

      const dbTodos = readFromDb();
      expect(dbTodos[0]).not.toHaveProperty('doneTimeStamp');
    })
  });

  describe('deleteTodo', () => {
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
