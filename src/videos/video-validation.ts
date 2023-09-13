import { Video, VideoResolution } from './videos-model';

export interface FieldError {
	message: string;
	field: VideoField;
}

type VideoField = keyof Video

const allowedResolutions = new Set([VideoResolution.P144, VideoResolution.P240, VideoResolution.P360, VideoResolution.P480, VideoResolution.P720, VideoResolution.P1080, VideoResolution.P1440, VideoResolution.P2160] as const);

export function validatePostVideo(body: any): FieldError[] {
	const postVideoFields: VideoField[] = ['title', 'author', 'availableResolutions'];

	return validateFields(postVideoFields, body);
}

export function validatePutVideo(body: any): FieldError[] {
	const putVideoFields: VideoField[] = ['title', 'author', 'availableResolutions', 'canBeDownloaded', 'minAgeRestriction', 'createdAt', 'publicationDate'];

	return validateFields(putVideoFields, body, true);
}


function validateFields(fields: VideoField[], body: any, areFieldsOptional?: boolean): FieldError[] {
	const fieldErrors: FieldError[] = [];

	fields.forEach((field: VideoField) => {
		if (!isValidField(field, body[field], areFieldsOptional)) {
			fieldErrors.push({
				message: `${ field } is incorrect`,
				field,
			});
		}
	});

	return fieldErrors;
}

function isValidField(field: VideoField, data: unknown, isOptional?: boolean): boolean {
	if (isOptional && data === undefined) {
		return true;
	}

	switch (field) {
		case 'author':
		case 'title': {
			return typeof data === 'string';
		}
		case 'availableResolutions': {
			return Array.isArray(data) && !data.some((resolution: VideoResolution) => !allowedResolutions.has(resolution))
		}
		case 'canBeDownloaded': {
			return typeof data === 'boolean';
		}
		case 'minAgeRestriction': {
			return data === null || typeof data === 'number' && Number.isInteger(data) && (data >= 1 || data <= 18)
		}
		case 'createdAt':
		case 'publicationDate': {
			return isDateValid(data)
		}

		default: {
			return false;
		}
	}
}

function isDateValid(data: unknown): boolean {
	if (typeof data !== 'string') {
		return false;
	}

	const date = new Date(data);

	return date instanceof Date && !isNaN(date.getTime()) && data === date.toISOString().split('T')[0];
}
