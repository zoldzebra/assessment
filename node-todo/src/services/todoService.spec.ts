import fs from 'fs';

import { NewTodo, Todo } from '../model/todo';
import { TodoService } from './todoService';
import { dbPathByEnv } from '../dbPathByEnv';

const TODO_1: Todo = {
	'id': '1',
	'text': 'Test todo 1',
	'priority': 2,
	'done': false
};
const TODO_2 = {
	'id': '2',
	'text': 'Test todo 2',
	'priority': 3,
	'done': false
};
const NEW_TODO = {
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
      const todos = [TODO_1, TODO_2];
			fs.writeFileSync(testDBPath, JSON.stringify(todos));
      const todoService = new TodoService();

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

      const buffer = fs.readFileSync(testDBPath, 'utf8');
      const rawTodos = JSON.parse(buffer);
      
      expect(rawTodos.length).toEqual(1);
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
  })
});

const purgeTestDb = () => {
	fs.writeFileSync(testDBPath, JSON.stringify([]));
};
