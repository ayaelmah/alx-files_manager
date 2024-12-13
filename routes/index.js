import express from 'express';
import AppController from '../controllers/AppController';
import UsersController, { getMe } from '../controllers/UsersController';
import { getConnect, getDisconnect } from '../controllers/AuthController';
import { postUpload, getIndex, getShow } from '../controllers/FilesController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);
router.get('/files', FilesController.getIndex);
router.get('/files/:id', FilesController.getShow);
router.get('/files/:id/data', FilesController.getFile);

router.post('/users', UsersController.postNew);
router.post('/files', postUpload);

router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

export default router;
