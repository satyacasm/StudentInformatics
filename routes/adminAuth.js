const { Router } = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const router = Router();
const auth = require('../middleware/auth');

router.post('/register', adminAuthController.signup);
router.post('/login', adminAuthController.login);
router.get('/user',auth, adminAuthController.get_user);
router.get('/logout',auth,adminAuthController.logout);

module.exports = router;
