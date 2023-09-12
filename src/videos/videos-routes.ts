import { Request, Response, Router } from "express";

import { Video, videosData, VideoResolution } from './videos-model';
import { validatePostVideo } from './video-validation';
import { generateRandomId } from '../utils';

const videosRouter = Router()

videosRouter.get('/', (req: Request, res: Response) => {
	res.send(videosData.data).status(200);
});

videosRouter.post('/', (req: Request, res: Response) => {
	const validationErrors = validatePostVideo(req.body);

	if (!validationErrors.length) {
		videosData.data.push({
			...req.body,
			id: generateRandomId()
		});

		console.log('videosData', videosData);
		res.send().status(201);
		return;
	}

	res.send({
		errorMessages: validationErrors
	}).status(400);
});

videosRouter.get('/:id', (req: Request, res: Response) => {
	const video = videosData.data.find((v: Video) => v.id === Number(req.params.id));

	if (!video) {
		res.status(404).send();
		return;
	}

	res.status(200).send(video);
});

videosRouter.put('/:id', (req: Request, res: Response) => {
	const videoIndex = videosData.data.findIndex((v: Video) => v.id === Number(req.params.id));

	if (videoIndex === -1) {
		res.status(404).send();
		return;
	}

	videosData.data[videoIndex] = req.body;

	res.status(204).send();
});

videosRouter.delete('/:id', (req: Request, res: Response) => {
	const video = videosData.data.find((v: Video) => v.id === Number(req.params.id));

	if (!video) {
		res.status(404).send();
		return;
	}

	videosData.data.filter((v: Video) => v.id !== video.id);

	res.status(204).send();
});

export default videosRouter;
