import express, { Request, Response } from 'express';
import cors from 'cors'

import videosRouter from './videos/videos-routes';
import { videosData } from './videos/videos-model';

export const app = express();
const port = process.env.PORT || 3005;

app.use(express.json());
app.use(cors())


app.use('/videos', videosRouter);
app.delete('/testing/all-data', (req: Request, res: Response) => {
	videosData.data = [];
	res.status(204).send();
});

app.listen(port, () => {
	console.log(`Video app listening on port ${ port }`)
})
