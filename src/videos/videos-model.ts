export enum VideoResolution {
	P144 = 'P144',
	P240 = 'P240',
	P360 = 'P360',
	P480 = 'P480',
	P720 = 'P720',
	P1080 = 'P1080',
	P1440 = 'P1440',
	P2160 = 'P2160',
}

export interface Video {
	id: number;
	title: string;
	author: string;
	canBeDownloaded: boolean;
	minAgeRestriction: number | null;
	createdAt: string;
	publicationDate: string;
	availableResolutions: VideoResolution[];
}

const videos: Video[] = [
	{
		id: 3452435,
		title: 'Mock video',
		author: 'Mark Zuck',
		canBeDownloaded: true,
		minAgeRestriction: null,
		createdAt: new Date().toISOString(),
		publicationDate: new Date().toISOString(),
		availableResolutions: [VideoResolution.P144, VideoResolution.P360, VideoResolution.P1080]
	}
];

export interface VideosData {
	data: Video[];
}

export const videosData: VideosData = {
	data: videos,
}
