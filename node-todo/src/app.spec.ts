import supertest from 'supertest';

import { app } from './app';

describe('The app', () => {

	it('GET / should answer \'Hello World!', async () => {
		const response = await supertest(app).get('/').send();
		expect(response.statusCode).toEqual(200);
		expect(response.text).toBe('Hello World!');
	});
});
