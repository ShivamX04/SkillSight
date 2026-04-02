const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authMiddlewares = require('../middlewares/auth.middlewares')

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.registerUserController);
 
/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */

router.post("/login", authController.loginUserController);

/** 
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add it to blacklist //
 * @acess Public
 */

router.get('/logout', authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

router.get('/get-me', authMiddlewares.authUser,authController.getMeController)

module.exports = router;