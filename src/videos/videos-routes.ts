import { Router } from "express";

import { videosController } from './videos-controller';

const videosRouter = Router()

videosRouter.get('/', videosController.getAll);

videosRouter.post('/', videosController.create);

videosRouter.get('/:id', videosController.getById);

videosRouter.put('/:id', videosController.updateById);

videosRouter.delete('/:id', videosController.deleteById);

export default videosRouter;
