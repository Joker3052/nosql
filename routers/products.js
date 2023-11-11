const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })


// localhost:3000/api/v1/products?categories=2342342,234234
router.get(`/`, async (req, res) => {
    try {
      let filter = {};
      if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
      }
  
      const productList = await Product.find(filter).populate('category');
  
      if (!productList || productList.length === 0) {
        return res.status(404).json({ success: false, message: 'No products found' });
      }
  
      res.send(productList);
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
  });
  
  router.get(`/:id`, async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category');
  
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      res.send(product);
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
  });
  
// router.post(`/`, async (req, res) => {
//     try {
//       const category = await Category.findById(req.body.category);
//       if (!category) return res.status(400).send('Invalid Category');
  
//       let product = new Product({
//         name: req.body.name,
//         description: req.body.description,
//         richDescription: req.body.richDescription,
//         image: req.body.image,
//         brand: req.body.brand,
//         price: req.body.price,
//         category: req.body.category,
//         countInStock: req.body.countInStock,
//         rating: req.body.rating,
//         numReviews: req.body.numReviews,
//         isFeatured: req.body.isFeatured,
//       });
  
//       product = await product.save();
  
//       if (!product) {
//         return res.status(500).send('The product cannot be created');
//       }
  
//       res.send(product);
//     } catch (error) {
//       // Xử lý lỗi nếu có
//       res.status(500).send(error);
//       res.status(500).send('An error occurred while processing your request.');
//     }
//   });
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  try {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).send('Invalid Category');

      const file = req.file;
      if (!file) return res.status(400).send('No image in the request');

      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      let product = new Product({
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
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
      // Xử lý ngoại lệ và trả về một phản hồi lỗi
      console.error('Error creating product:', error);
      res.status(500).send('Internal Server Error');
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
  

  router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        productCount: productCount
    });
})


router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count || 0;
    const products = await Product.find({ isFeatured: true }).limit(parseInt(count));

    if (products && products.length > 0) {
        res.send(products);
    } else {
        res.status(404).json({ success: false, message: 'No featured products found' });
    }
});
router.put(
  '/gallery-images/:id', 
  uploadOptions.array('images', 10), 
  async (req, res) => {
      try {
          if (!mongoose.isValidObjectId(req.params.id)) {
              return res.status(400).send('Invalid Product Id');
          }

          const files = req.files;
          let imagesPaths = [];
          const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

          if (files) {
              files.map(file => {
                  imagesPaths.push(`${basePath}${file.filename}`);
              });
          }

          const product = await Product.findByIdAndUpdate(
              req.params.id,
              {
                  images: imagesPaths
              },
              { new: true }
          );

          if (!product) {
              return res.status(500).send('The gallery cannot be updated!');
          }

          res.send(product);
      } catch (error) {
          // Xử lý ngoại lệ và trả về một phản hồi lỗi
          console.error('Error updating gallery:', error);
          res.status(500).send('Internal Server Error');
      }
  }
);
  

module.exports =router;