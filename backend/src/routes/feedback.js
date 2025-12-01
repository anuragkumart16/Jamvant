import { Router } from 'express';
import { createFeedback,getFeedback } from '../controllers/feedback.js';
import checkUser from '../middleware/auth.js';

const router = Router();

router.route('/create').post(checkUser,createFeedback);
router.route('/').get(checkUser,getFeedback)

export default router;
