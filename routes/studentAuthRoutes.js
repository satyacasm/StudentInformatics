const { Router } = require('express');
const studentAuthController = require('../controllers/studentAuthController');
const router = Router();
const auth = require('../middleware/StudentAuth');
const StudentAuth = require('../middleware/StudentAuth');

router.post('/login',studentAuthController.login);
router.get('/dashboard',StudentAuth,studentAuthController.studentDashboard)
router.get('/logout',StudentAuth,studentAuthController.logout)
module.exports=router;