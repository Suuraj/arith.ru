const Router = require('express');
const router = new Router();
const controller = require('./controller');
const authMiddleware = require('./middleware/auth.middleware');

router.post('/signin', controller.sigin);
router.post('/username', authMiddleware, controller.username);
router.get('/auth', authMiddleware, controller.auth);
router.get('/get', authMiddleware, controller.get);
router.post('/set', authMiddleware, controller.set);
router.get('/leaders', controller.leaders);

module.exports = router;
