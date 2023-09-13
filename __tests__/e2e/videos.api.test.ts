import request from 'supertest';
import { app } from '../../src/index';

describe('/videos', () => {
	it('should return 200', () => {
		request(app)
			.get('/videos')
			.expect(200);
	})
});
