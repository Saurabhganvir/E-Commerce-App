import express from 'express';
import { forgotPasswordController, getAllOrdersController, getOrdersController, loginController, orderStatusController, registerController , testController, updateProfileController} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

//seperate router object is required if files are seperate
const router = express.Router();

//routing
//REGISTER||method POST
//callback function will be imported from controllers
router.post('/register', registerController);

//LOGIN route || POST request
router.post('/login', loginController);

//test route 
router.get('/test', requireSignIn, isAdmin, testController);

//Forgot password
router.post('/forgot-password', forgotPasswordController);

//protected user route auth
router.get('/user-auth', requireSignIn, (req, res)=>{
    res.status(200).send({ ok:true });
})

//protected Admin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res)=>{
    res.status(200).send({ok:true});
})

//update profile
router.put('/profile', requireSignIn, updateProfileController);

//orders
router.get('/orders', requireSignIn, getOrdersController)

//All orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
  );

export default router;