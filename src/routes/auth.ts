import { Router } from 'express'
import { login, logout } from '../controllers/AuthController'
import validateRequest from '../middlewares/validateRequest'
import authenticate from '../middlewares/authenticate'
import { loginSchema } from '../schemas/authSchemas'
import { loginRateLimiter } from '../middlewares/rateLimiters'

const router = Router()

router.post('/login', loginRateLimiter, validateRequest(loginSchema), login)
router.post('/logout', authenticate, logout)

export default router
