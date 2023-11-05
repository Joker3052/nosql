const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors())
// Middleware
app.use(express.json()); // Sử dụng express.json() để xử lý JSON
app.use(morgan('tiny'));

//Routes
const productsRoutes = require('./routers/products');
// Mô hình sản phẩm
// const productSchema = mongoose.Schema({
//     name: String,
//     image: String,
//     countStock: Number
// });

// const Product = mongoose.model('e-Collection', productSchema); // Đổi tên mô hình thành 'Product'

const api = process.env.API_URL;
app.use(`/1`, productsRoutes);

// app.get(api + '/', async (req, res) =>{
//  const productList =await Product.find();
//  res.send(productList);
// })
// app.post(api + '/', (req, res) => {
//     // Lấy dữ liệu từ yêu cầu (request)
//     const { name, image, countStock } = req.body;

//     // Tạo một đối tượng sản phẩm mới
//     const product = new Product({
//         name: name,
//         image: image,
//         countStock: countStock
//     });

//     // Lưu sản phẩm vào cơ sở dữ liệu
//     product.save()
//         .then(createdProduct => {
//             // Trả về "added" khi POST thành công
//             res.status(201).json({ message: "added" });
//         })
//         .catch(err => {
//             console.error(err);
//             // Trả về "fail" khi gặp lỗi
//             res.status(500).json({ message: "fail" });
//         });
// });


// Kết nối với cơ sở dữ liệu
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'edatabase'
})
    .then(() => {
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.error(err);
    });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
