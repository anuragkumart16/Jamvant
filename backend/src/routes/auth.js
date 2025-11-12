import {Router} from 'express'
import { signup,login, checkEmail } from '../controllers/auth.js'

const router = Router()

router.route('/signup').post(signup)
router.route('/check-email').post(checkEmail)
router.route('/login').post(login)

export default router