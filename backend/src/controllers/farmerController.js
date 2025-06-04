import ProductLine from '../models/productLine.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

// Thêm sản phẩm vào dòng sản phẩm (chỉ khi đã đăng ký dòng sản phẩm)
export const addProductToLine = async (req, res) => {
  try {
    const { productLine, name, price, quantity } = req.body;
    const productLineDoc = await ProductLine.findById(productLine);
    if (!productLineDoc) return res.status(404).json({ message: 'Product line not found' });

    const product = new Product({
      productLine,
      name,
      price,
      quantity,
      availableQuantity: quantity,
      status: 'pending'
    });
    await product.save();
    res.status(201).json({ message: 'Product added to product line', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cập nhật giá sản phẩm
export const updateProductPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { price },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product price updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xem tổng quan hàng hóa và thông số mua sắm trong shop của mình
export const getFarmerOverview = async (req, res) => {
  try {
    const farmerId = req.user?._id || req.params.farmerId;
    // Lấy tất cả dòng sản phẩm của farmer
    const productLines = await ProductLine.find({ farmer: farmerId });
    const productLineIds = productLines.map(line => line._id);

    // Lấy tất cả sản phẩm thuộc các dòng sản phẩm đó
    const products = await Product.find({ productLine: { $in: productLineIds } });

    // Thống kê sản phẩm bán chạy nhất và tồn kho nhiều nhất trong quý
    const now = new Date();
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);

    const topSoldQuarter = await Product.aggregate([
      { $match: { productLine: { $in: productLineIds }, createdAt: { $gte: startOfQuarter } } },
      { $group: { _id: "$name", totalSold: { $sum: "$quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 1 }
    ]);

    const mostStockQuarter = await Product.aggregate([
      { $match: { productLine: { $in: productLineIds }, createdAt: { $gte: startOfQuarter } } },
      { $group: { _id: "$name", totalStock: { $sum: "$availableQuantity" } } },
      { $sort: { totalStock: -1 } },
      { $limit: 1 }
    ]);

    res.status(200).json({
      productLines,
      products,
      topSoldQuarter,
      mostStockQuarter
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};