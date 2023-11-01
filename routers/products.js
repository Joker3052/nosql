const Product = require('../models/product')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) =>{
    const productList =await Product.find();
    res.send(productList);
   })


   router.post('/', (req, res) => {
    // Lấy dữ liệu từ yêu cầu (request)
    const { name, image, countStock } = req.body;

    // Tạo một đối tượng sản phẩm mới
    const product = new Product({
        name: name,
        image: image,
        countStock: countStock
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    product.save()
        .then(createdProduct => {
            // Trả về "added" khi POST thành công
            res.status(201).json({ message: "added" });
        })
        .catch(err => {
            console.error(err);
            // Trả về "fail" khi gặp lỗi
            res.status(500).json({ message: "fail" });
        });
});
 
   module.exports = router