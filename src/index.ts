import express from 'express';
import cors from 'cors'

import videosRouter from './videos/videos-routes';
import { videosController } from './videos/videos-controller';

export const app = express();
const port = process.env.PORT || 3005;

app.use(express.json());
app.use(cors())

app.use('/videos', videosRouter);
app.delete('/testing/all-data', videosController.deleteAll);

app.listen(port, () => {
	console.log(`Video api app listening on port ${ port }`)
})
