import { Request, Response, Router } from "express";

import { Video, videosData, VideoResolution } from './videos-model';
import { validatePostVideo, validatePutVideo } from './video-validation';

const videosRouter = Router()

videosRouter.get('/', (req: Request, res: Response) => {
	res.status(200).send(videosData.data);
});

videosRouter.post('/', (req: Request, res: Response) => {
	const validationErrors = validatePostVideo(req.body);

	if (!validationErrors.length) {
		const createdDate = new Date();
		const publicationDate = new Date(createdDate.getTime() + 86400000);
		videosData.data.push({
			...req.body,
			createdAt: createdDate.toISOString(),
			publicationDate: publicationDate.toISOString(),
			canBeDownloaded: false,
			minAgeRestriction: null,
		});

		res.status(201).send();
		return;
	}

	res.status(400).send({
		errorMessages: validationErrors
	});
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

	const validationErrors = validatePutVideo(req.body);

	if (validationErrors.length) {
		res.status(400).send({
			errorMessages: validationErrors
		});

		return;
	}

	videosData.data[videoIndex] = {
		...videosData.data[videoIndex],
		...req.body,
	};

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
