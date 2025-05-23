import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res)=>{
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            res.status(200).send({success:true, message:"category already exists"});
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save();
        res.status(201).send({success:true, message:"new category created", category,});
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message:'Error in category controller',
        })
    }
};


//update category
export const updateCategoryController = async (req, res) =>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)}, {new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated successfully",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while updating category'
        })
    }
};

export const categoryController = async (req, res)=>{
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:'All category list',
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while accessing all categories',
        })
    }
};


//single category controller
export const singleCategoryController = async(req,res) =>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"Category found successfully",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message:"Error while accessing category",
        })
    }
};

//delete category controller

export const deleteCategoryController = async(req, res) =>{
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"category deleted successfully",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while deleting category",
        })
    }
};