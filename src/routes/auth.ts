import { Router } from 'express'
import { login } from '../controllers/AuthController'
import validateRequest from '../middlewares/validateRequest'
import { loginSchema } from '../schemas/authSchemas'
import { loginRateLimiter } from '../middlewares/rateLimiters'

const router = Router()

router.post('/login', loginRateLimiter, validateRequest(loginSchema), login)

export default router
