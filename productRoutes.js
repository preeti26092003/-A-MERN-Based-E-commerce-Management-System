import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCountController, productFiltersController, productListController, productPhotoController, searchProductController, updateProductController } from '../controller/productController.js'
import formidable from 'express-formidable'
 
const router = express.Router()

//routes
router.post('/create-product', requireSignIn,isAdmin,formidable(), createProductController);

//get products
router.get('/get-product', getProductController)

//single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//routes
router.put('/update-product/:pid', requireSignIn,isAdmin,formidable(), updateProductController);

//filter products
router.post('/product-filters',productFiltersController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword', searchProductController)

export default router

