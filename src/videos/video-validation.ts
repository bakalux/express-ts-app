import { Video, VideoResolution } from './videos-model';

export interface FieldError {
	message: string;
	field: keyof Video;
}

const allowedResolutions = new Set([VideoResolution.P144, VideoResolution.P240, VideoResolution.P360, VideoResolution.P480, VideoResolution.P720, VideoResolution.P1080, VideoResolution.P1440, VideoResolution.P2160]);

export function validatePostVideo(body: any): FieldError[] {
	const fieldErrors: FieldError[] = [];

	if (typeof body.title !== 'string') {
		fieldErrors.push({
			message: 'Title is incorrect',
			field: 'title',
		});
	}

	if (typeof body.author !== 'string') {
		fieldErrors.push({
			message: 'Author is incorrect',
			field: 'author'
		})
	}

	if (body.availableResolutions) {
		if (!Array.isArray(body.availableResolutions)) {
			fieldErrors.push({
				message: 'availableResolutions is incorrect',
				field: 'availableResolutions',
			})
		} else {
			const hasRestrictedResolution = body.availableResolutions.some((resolution: VideoResolution) => !allowedResolutions.has(resolution));

			if (hasRestrictedResolution) {
				fieldErrors.push({
					message: 'some of available resolutions are incorrect',
					field: 'availableResolutions',
				});
			}
		}
	}

	return fieldErrors;
}
