// const express = require("express");
// const colors = require("colors");

import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from 'morgan';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path'
import { fileURLToPath } from "url";

//config env
dotenv.config();

//database config
connectDB();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

//rest api
// this was used for local 
// app.get('/', (req, res)=>{
//     res.send("<h1>Welcome to E-Com app 2025</h1>");
// });

//this will be used for deployment
app.use("*", function(req, res){
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

//port
const PORT = process.env.PORT || 8080;

//run the server\
app.listen(PORT, ()=>{
    console.log(`Server is running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.red)
})