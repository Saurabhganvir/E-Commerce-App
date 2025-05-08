import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken';
import orderModel from "../models/orderModel.js";


//registration controller ||post 
export const registerController = async (req, res)=>{
    try {
        const {name, email, password, phone, address, answer} = req.body;
        //validation
        if(!name)return res.send({message:'Name is required'});
        if(!email)return res.send({message:'Email is required'});
        if(!password)return res.send({message:'Password is required'});
        if(!phone)return res.send({message:'Phone number is required'});
        if(!address)return res.send({message:'Address is required'});
        if(!answer)return res.send({message:"Answer is Required"});

        //checking user
        const existingUser = await userModel.findOne({email});

        //checking existing user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'User already registered! Please login'
            })
        }

        //hash new password
        const hashedPassword = await hashPassword(password);

        //register new user and save
        const user =await new userModel({name, email, phone, address, password:hashedPassword, answer}).save();

        res.status(200).send({
            success:true,
            message:'User succesfully registered',
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in registration',
            error
        });
    }
};

export const loginController = async (req, res)=>{
    try {
        const {email, password} = req.body;
        //validating email an password field
        if(!email || !password)return res.status(404).send({
            success:false,
            message:'Invalid email or password'
        });

        //check user
        const user = await userModel.findOne({email});

        if(!user)return res.status(404).send({
            success:false,
            message:'user is not registered'
        });

        //checking passwords and decoding 
        const match = await comparePassword(password, user.password);

        //validating password
        if(!match)return res.status(200).send({
            success:false,
            message:'Incorrect password'
        });

        //create token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
            expiresIn:'7d',
        });

        res.status(200).send({
            success:true,
            message:'Login successful',
            user:{
                name: user.name,
                email:user.email,
                phone: user.phone,
                address: user.address,
                role:user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error in Login',
            error
        });
    }
};

// forgot password controller
export const forgotPasswordController = async(req, res)=>{
    try {
        //destructuring from body
        const {email, answer, newPassword} = req.body;
        //validating fields
        if(!email){res.status(400).send({message:"email is required"});}
        if(!answer){res.status(400).send({message:"answer is required"});}
        if(!newPassword){res.status(400).send({message:"new password is required"});}
        //aunthentication 
        const user = await userModel.findOne({email, answer});
        //validating user
        if(!user){res.status(404).send({success:false,message:"wrong email or answer"});}
        //hashing new password
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password:hashed});
        res.status(200).send({
            success:true,
            message:"Password succefully Updated",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong in forgot password!",
            error
        })
    }
};

export const testController = async(req, res)=>{
    try {
        res.send('Protected Route');
    } catch (error) {
        console.log(error);
        res.send({error});
    }
};

//update profile controller
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };

  //orders
  export const getOrdersController = async(req, res)=>{
    try {
        const orders = await orderModel.find({buyer:req.user._id}).populate("products", '-photo').populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while Getting Orders",
            error,
        })
    }
  };

  //all orders admin
  export const getAllOrdersController = async(req, res)=>{
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting all orders",
            error,
        })
    }
  }

  //order status
export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };