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

	it('should return 201', async () => {
		await request(app).post('/videos')
			.send({
				title: 'asdfads',
				author: 'asdfas',
				availableResolutions: ['P1080', 'P360', 'P720']
			})
			.expect(201)
	});

	it('should return validation error and 400', async () => {
		await request(app).post('/videos')
			.send({
				title: 'asdfasd',
			})
			.expect({
				errorsMessages: [
					{
						field: 'author',
						message: 'author is incorrect'
					}
				]
			})
			.expect(400)

		await request(app).post('/videos')
			.send({
				author: 'asdfasd',
			})
			.expect({
				errorsMessages: [
					{
						field: 'title',
						message: 'title is incorrect'
					}
				]
			})
			.expect(400)

		await request(app).post('/videos')
			.send({
				author: 'asdfasd',
				title: 'asdfasd',
				availableResolutions: ['P143'],
			})
			.expect({
				errorsMessages: [
					{
						field: 'availableResolutions',
						message: 'availableResolutions is incorrect'
					}
				]
			})
			.expect(400)
	});
});

describe('/videos/:id', () => {
	it('should return 200', async () => {
		await request(app).get('/videos/3452435')
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

	it('should return validation error and 400', async () => {
		await request(app).put('/videos/3452435')
			.send({
				title: 12341325,
				author: 3412345,
			})
			.expect({
				errorsMessages: [
					{
						field: 'title',
						message: 'title is incorrect'
					},
					{
						field: 'author',
						message: 'author is incorrect'
					}
				]
			})
			.expect(400)


		await request(app).put('/videos/3452435')
			.send({
				author: 'asdfasd',
				title: 'asdfasd',
				availableResolutions: ['P143'],
			})
			.expect({
				errorsMessages: [
					{
						field: 'availableResolutions',
						message: 'availableResolutions is incorrect'
					}
				]
			})
			.expect(400)

		await request(app).put('/videos/3452435')
			.send({
				author: 'asdfasd',
				title: 'asdfasd',
				availableResolutions: ['P1440'],
				minAgeRestriction: 25
			})
			.expect({
				errorsMessages: [
					{
						field: 'minAgeRestriction',
						message: 'minAgeRestriction is incorrect'
					}
				]
			})
			.expect(400)

		await request(app).put('/videos/3452435')
			.send({
				author: 'asdfasd',
				title: 'asdfasd',
				availableResolutions: ['P1440'],
				minAgeRestriction: 18,
				canBeDownloaded: {},
			})
			.expect({
				errorsMessages: [
					{
						field: 'canBeDownloaded',
						message: 'canBeDownloaded is incorrect'
					}
				]
			})
			.expect(400)

		await request(app).put('/videos/3452435')
			.send({
				author: 'asdfasd',
				title: 'asdfasd',
				availableResolutions: ['P144'],
				createdAt: 123465366,
				publicationDate: 42534523,
			})
			.expect({
				errorsMessages: [
					{
						field: 'createdAt',
						message: 'createdAt is incorrect'
					},
					{
						field: 'publicationDate',
						message: 'publicationDate is incorrect'
					}
				]
			})
			.expect(400)
	});

	it('should return 204', async () => {
		await request(app).put('/videos/3452435')
			.send({
				author: 'asdfasd',
				title: 'asdfasd',
				availableResolutions: ['P144', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'],
				createdAt: new Date().toISOString(),
				publicationDate: new Date().toISOString(),
				minAgeRestriction: 16,
				canBeDownloaded: true,
			})
			.expect(204)

		await request(app).delete('/videos/3452435')
			.expect(204)
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
