import request from 'supertest';

import { app, server } from '../../src/index';
import { CreateVideoModel, PutVideoModel, VideoResolution, ViewVideoModel } from '../../src/videos/videos-model';


let createdVideo: ViewVideoModel;

export type UnknownPutVideoModel = {
  [K in keyof PutVideoModel]: unknown;
};

beforeAll(async () => {
	await request(app).delete('/testing/all-data');

	const createVideoData: CreateVideoModel = {
		title: 'kek',
		author: 'shrek',
	}

	const response = await request(app).post('/videos')
		.send(createVideoData);

	createdVideo = response.body;
});

afterAll(async () => {
	server.close();
})

describe('/videos', () => {
	it('should return 200 with proper created video', async () => {
		const expectedVideo: ViewVideoModel = {
			title: 'kek',
			author: 'shrek',
			id: 1,
			minAgeRestriction: null,
			canBeDownloaded: false,
			createdAt: expect.any(String),
			publicationDate: expect.any(String),
			availableResolutions: [],
		};

		const res = await request(app).get('/videos')
			.expect(200);

		expect(res.body).toEqual([expectedVideo]);
	});

	it('should return 201', async () => {
		const createVideoData: CreateVideoModel = {
			title: 'asdfads',
			author: 'asdfas',
			availableResolutions: [VideoResolution.P480, VideoResolution.P360, VideoResolution.P720]
		};
		await request(app).post('/videos')
			.send(createVideoData)
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
		await request(app).get(`/videos/${ createdVideo.id }`)
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
		await request(app).put(`/videos/${ createdVideo.id }`)
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


		await request(app).put(`/videos/${ createdVideo.id }`)
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

		const dataWithWrongAge: UnknownPutVideoModel = {
			author: 'asdfasd',
			title: 'asdfasd',
			availableResolutions: [VideoResolution.P1440],
			minAgeRestriction: 25
		}

		await request(app).put(`/videos/${ createdVideo.id }`)
			.send(dataWithWrongAge)
			.expect({
				errorsMessages: [
					{
						field: 'minAgeRestriction',
						message: 'minAgeRestriction is incorrect'
					}
				]
			})
			.expect(400)

		const dataWithWrongDownloaded: UnknownPutVideoModel = {
			author: 'asdfasd',
			title: 'asdfasd',
			availableResolutions: [VideoResolution.P240],
			minAgeRestriction: 18,
			canBeDownloaded: {},
		}

		await request(app).put(`/videos/${ createdVideo.id }`)
			.send(dataWithWrongDownloaded)
			.expect({
				errorsMessages: [
					{
						field: 'canBeDownloaded',
						message: 'canBeDownloaded is incorrect'
					}
				]
			})
			.expect(400)

		const dataWithWrongDates: UnknownPutVideoModel = {
			author: 'asdfasd',
			title: 'asdfasd',
			availableResolutions: [VideoResolution.P720],
			createdAt: 123465366,
			publicationDate: 42534523,
		}

		await request(app).put(`/videos/${ createdVideo.id }`)
			.send(dataWithWrongDates)
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
		const data: PutVideoModel = {
			author: 'asdfasd',
			title: 'asdfasd',
			availableResolutions: [VideoResolution.P144, VideoResolution.P240, VideoResolution.P360, VideoResolution.P480, VideoResolution.P720, VideoResolution.P1080, VideoResolution.P1440, VideoResolution.P2160],
			createdAt: new Date().toISOString(),
			publicationDate: new Date().toISOString(),
			minAgeRestriction: 16,
			canBeDownloaded: true,
		};

		await request(app).put(`/videos/${ createdVideo.id }`)
			.send(data)
			.expect(204)

		await request(app).delete(`/videos/${ createdVideo.id }`)
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
