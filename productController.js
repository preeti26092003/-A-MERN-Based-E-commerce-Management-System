import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'

export const createProductController = async (req,res) => {
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error: 'Name is Required'})
            case !description:
                return res.status(500).send({error: 'Description is Required'})
            case !price:
                return res.status(500).send({error: 'Price is Required'})
            case !category:
                return res.status(500).send({error: 'Category is Required'})
            case !quantity:
                return res.status(500).send({error: 'Quantity is Required'})
            case ! photo && photo.size > 1000000:
                return res.status(500).send({error: 'Photo is Required and shpould be less tha 1mb'})
            
                
        }
        const products = new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:'Product Created successfully',
            products,
        })
    } catch (error) {
       console.log(error) 
       res.status(500).send({
        success:false,
        error,
        message: 'Error in creating product'
       })
    }
};

// get all products
export const getProductController = async (req,res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success: true,
            counttotal : products.length,
            message: "All products" ,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in getting products' ,
            error:error.message
        })
    }
};

//get single product
export const getSingleProductController = async(req,res) => {
    try {
        const products = await productModel.findOne({slug:req.params.slug}).select("-photo").populate('category')
        res.status(200).send({
            success: true,
            message: "Single product fetched" ,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'error while getting single product',
            error
        })
    }
};

//get photo
export const productPhotoController = async (req,res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'error while getting photo',
            error
    })
    }
};

//delete controller
export const deleteProductController = async (req, res) => {
    try {
      console.log('Received delete request for product ID:', req.params.pid); // Log the incoming ID
  
      // Attempt to delete the product
      const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo");
  
      // Check if the product was found and deleted
      if (!product) {
        console.log('Product not found with ID:', req.params.pid); // Log if product is not found
        return res.status(404).send({
          success: false,
          message: 'Product not found',
        });
      }
  
      // Successful deletion
      res.status(200).send({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.log('Error while deleting product:', error); // Log the error
      res.status(500).send({
        success: false,
        message: 'Error while deleting product',
        error,
      });
    }
  };
  
  
  

//update product 
export const updateProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } = req.fields;
      const { photo } = req.files;
  
      // Validation
      switch (true) {
        case !name:
          return res.status(500).send({ error: 'Name is required' });
        case !description:
          return res.status(500).send({ error: 'Description is required' });
        case !price:
          return res.status(500).send({ error: 'Price is required' });
        case !category:
          return res.status(500).send({ error: 'Category is required' });
        case !quantity:
          return res.status(500).send({ error: 'Quantity is required' });
        case photo && photo.size > 1000000:  // Ensure photo exists before checking size
          return res.status(500).send({ error: 'Photo should be less than 1MB' });
      }
  
      const product = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).send({ error: 'Product not found' });
      }
  
      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }
  
      await product.save();
      res.status(201).send({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in updating product',
        error,
      });
    }
  };

  //filters
  export const productFiltersController = async (req,res) =>{
    try {
      const {checked, radio} = req.body
      let args = {}
      if(checked.length > 0) args.category = checked
      if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]}
      const products = await productModel.find(args)
      res.status(200).send({
        success:true,
        products,
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        message: 'Error while filtering products',
        error
      })
    }
  }

  //product count
  export const productCountController = async (req,res) => {
    try {
      const total = await productModel.find({}).estimatedDocumentCount()
      res.status(200).send({
        success:true,
        total,
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        message: 'Error in product count',
        error,
        success:false
      })
    }
  }

  //product list based on page
  export const productListController = async (req,res) => {
    try {
      const perPage = 6
      const page = req.params.page ? req.params.page : 1
      const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt: -1});
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        message:'error in per page ctrl',
        error
      })
    }
  }
  //search product
  export const searchProductController = async (req,res) => {
    try {
      const {keyword} = req.params
      const result = await productModel.find({
        $or:[
          {name: {$regex :keyword, $options:"i"}},
          {description: {$regex :keyword, $options:"i"}},         
        ],
      }).select("-photo")
       res.json(results);
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        message:'Error in search Product API',
        error
    })
  }
  };