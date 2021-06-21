import fs from 'fs';

import { TodoService } from './todoService';
import { dbPathByEnv } from '../dbPathByEnv';

const TODO_1 = {
	'id': 1,
	'text': 'Test todo 1',
	'priority': 2,
	'done': false
};
const TODO_2 = {
	'id': 2,
	'text': 'Test todo 2',
	'priority': 3,
	'done': false
};

const todoService = new TodoService();
const testDBPath = dbPathByEnv();

describe('TodoService', () => {
	beforeAll(() => {
		purgeTestDb();
	});
	describe('getTodos', () => {
		afterEach (() => {
			purgeTestDb();
		});

		it('should return empty array if db is empty', () => {
			const results = todoService.getAllTodos();

			expect(results).toStrictEqual([]);
		});

		it('should return all todos from db', () => {
			const todos = [TODO_1, TODO_2];
			fs.writeFileSync(testDBPath, JSON.stringify(todos));

			const results = todoService.getAllTodos();

			expect(results).toEqual(expect.arrayContaining(todos));
		});

	});
});

const purgeTestDb = () => {
	fs.writeFileSync(testDBPath, JSON.stringify([]));
};
