import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController } from '../controller/categoryController.js';

const router = express.Router();

// Routes
// Create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

// Update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// Get all categories
router.get('/get-category', categoryController); // This should work correctly

//single category
router.get('/single-category/:slug', singleCategoryController)

//delete category
router.delete('/delete-category/:id' , requireSignIn,isAdmin, deleteCategoryCOntroller)

export default router;
