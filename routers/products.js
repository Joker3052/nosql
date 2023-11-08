const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) =>{
    // localhost:3000/api/v1/products?categories=2342342,234234
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})

router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);
})

router.post(`/`, async (req, res) => {
    try {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).send('Invalid Category');
  
      let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      });
  
      product = await product.save();
  
      if (!product) {
        return res.status(500).send('The product cannot be created');
      }
  
      res.send(product);
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).send('An error occurred while processing your request.');
    }
  });
  
router.put('/:id', async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
      }
  
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).send('Invalid Category');
      }
  
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          image: req.body.image,
          brand: req.body.brand,
          price: req.body.price,
          category: req.body.category,
          countInStock: req.body.countInStock,
          rating: req.body.rating,
          numReviews: req.body.numReviews,
          isFeatured: req.body.isFeatured,
        },
        { new: true }
      );
  
      if (!product) {
        return res.status(500).send('The product cannot be updated');
      }
  
      res.send(product);
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).send('An error occurred while processing your request');
    }
  });
  
router.delete('/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndRemove(req.params.id);
      if (product) {
        return res.status(200).json({ success: true, message: 'The product is deleted' });
      } else {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ success: false, error: error });
    }
  });
  

  router.get(`/count`, async (req, res) => {
    try {
      const productCount = await Product.countDocuments((count) => count);
  
      if (!productCount) {
        return res.status(500).json({ success: false });
      }
      
      res.send({
        productCount: productCount
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
  });
  
  router.get(`/featured/:count`, async (req, res) => {
    try {
      const count = req.params.count ? req.params.count : 0;
      const products = await Product.find({ isFeatured: true }).limit(+count);
  
      if (!products || products.length === 0) {
        return res.status(404).json({ success: false, message: 'No featured products found' });
      }
      
      res.send(products);
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
  });
  

module.exports =router;