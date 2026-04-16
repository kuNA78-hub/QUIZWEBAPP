import express from 'express';
import { submitQuiz, getUserResults } from '../controllers/resultController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateUser);
router.post('/', submitQuiz);
router.get('/my-results', getUserResults);
export default router;