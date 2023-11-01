const mongoose = require('mongoose');
// Mô hình sản phẩm
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countStock: Number
});
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});
// const Product = mongoose.model('e-Collection', productSchema); // Đổi tên mô hình thành 'Product'
// exports.Product;
module.exports = mongoose.model('e-Collection', productSchema);
