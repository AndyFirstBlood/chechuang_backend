import express from 'express';
import userCtrl from '../controller/user.controller';

const router = express.Router();

router.route('/smscode/:mobilephonenumber')
      .get(userCtrl.requestSmsCode)

router.route('/verify/phone')
      .post(userCtrl.verifyMobilePhone)

//sign in or login in with phone
router.route('/signuporlogin/phone')
      .post(userCtrl.signUpOrlogInWithMobilePhone)

export default router;