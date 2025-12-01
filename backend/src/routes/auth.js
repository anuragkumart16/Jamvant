import {Router} from 'express'
import { signup,login, checkEmail, forgotPassword, resetPassword } from '../controllers/auth.js'

const router = Router()

router.route('/signup').post(signup)
router.route('/check-email').post(checkEmail)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)

export default router