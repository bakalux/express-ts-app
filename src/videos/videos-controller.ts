import { Request, Response } from 'express';
import { getVideos, setVideos, Video } from './videos-model';
import { validatePostVideo, validatePutVideo } from './videos-validation';

let idIndex = 1;

export class VideosController {
	getAll(req: Request, res: Response): void {
		res.status(200).send(getVideos());
	}

	getById(req: Request, res: Response): void {
		const videos = getVideos()
		const video = videos.find((v: Video) => v.id === Number(req.params.id));

		if (!video) {
			res.status(404).send();
			return;
		}

		res.status(200).send(video);
	}

	create(req: Request, res: Response): void {
		const validationErrors = validatePostVideo(req.body);

		if (!validationErrors.length) {
			const createdDate = new Date();
			const publicationDate = new Date(createdDate.getTime() + 86400000);

			const video = {
				...req.body,
				id: idIndex,
				createdAt: createdDate.toISOString(),
				publicationDate: publicationDate.toISOString(),
				canBeDownloaded: false,
				minAgeRestriction: null,
				availableResolutions: req.body.availableResolutions ?? [],
			}
			idIndex++;

			const videos = getVideos();
			setVideos([...videos, video]);

			res.status(201).send(video);
			return;
		}

		res.status(400).send({
			errorsMessages: validationErrors
		});
	}

	updateById(req: Request, res: Response): void {
		const videos = getVideos();
		const videoIndex = videos.findIndex((v: Video) => v.id === Number(req.params.id));

		if (videoIndex === -1) {
			res.status(404).send();
			return;
		}

		const validationErrors = validatePutVideo(req.body);

		if (validationErrors.length) {
			res.status(400).send({
				errorsMessages: validationErrors
			});

			return;
		}

		videos[videoIndex] = {
			...videos[videoIndex],
			...req.body,
		};

		setVideos(videos);

		res.status(204).send();
	}

	deleteById(req: Request, res: Response): void {
		const videos = getVideos();
		const video = videos.find((v: Video) => v.id === Number(req.params.id));

		if (!video) {
			res.status(404).send();
			return;
		}

		setVideos(videos.filter((v: Video) => v.id !== video.id));

		res.status(204).send();
	}

	deleteAll(req: Request, res: Response): void {
		setVideos([]);
		res.status(204).send();
	}
}

export const videosController = new VideosController();
