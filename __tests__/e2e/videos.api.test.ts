import request from 'supertest';
import { app } from '../../src/index';
import { getVideos } from '../../src/videos/videos-model';

describe('/videos', () => {
	const initVideos = getVideos();
	it('should return 200', async () => {
		await request(app).get('/videos')
			.expect(initVideos)
			.expect(200)
	});

	it('should return 404', async () => {
		await request(app).get('/videos/234524352345')
			.expect(404)

		await request(app).put('/videos/234524352345')
			.expect(404)

		 await request(app).delete('/videos/234524352345')
			.expect(404)
	});
});

describe('/testing', () => {
	it('should delete all data and return 204', async () => {
		await request(app)
			.delete('/testing/all-data')
			.expect({})
			.expect(204)
	});
});
