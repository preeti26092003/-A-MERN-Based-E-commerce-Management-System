import categoryModel from "../models/categoryModel.js";
import slugify from 'slugify';

// Create Category Controller
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(409).send({
                success: false,
                message: 'Category already exists',
            });
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });

    } catch (error) {
        console.error('Error in createCategoryController:', error);
        res.status(500).send({
            success: false,
            message: 'Error in Category',
            error: error.message, // Return error message for debugging
        });
    }
};

// Update Category Controller
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }

        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category,
        });

    } catch (error) {
        console.error('Error in updateCategoryController:', error);
        res.status(500).send({
            success: false,
            message: 'Error while updating category',
            error: error.message, // Return error message for debugging
        });
    }
};

// Get All Categories Controller
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All categories list",
            category
        });
    } catch (error) {
        console.error('Error in categoryController:', error);
        res.status(500).send({
            success: false,
            message: "Error while getting all categories",
            error: error.message, // Return error message for debugging
        });
    }
};

// Single Category Controller
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug }); // Corrected the slug reference
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Single category fetched successfully',
            category,
        });
    } catch (error) {
        console.error('Error in singleCategoryController:', error); // Updated error log for clarity
        res.status(500).send({
            success: false,
            error: error.message, // Added error message for debugging
            message: 'Error while getting Single category',
        });
    }
};
  
//delete category
export const deleteCategoryCOntroller = async(req,res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'çategory deleted successfully'
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while deleting category',
            error
        })
    }
};
