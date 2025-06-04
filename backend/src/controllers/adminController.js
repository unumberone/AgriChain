import Product from '../models/product.js';
import ProductLine from '../models/productLine.js';
import Order from '../models/order.js';


// Thêm sản phẩm mới (Farmer)
export const createProduct = async (req, res) => {
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
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy tất cả sản phẩm (customer, Admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('productLine');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy sản phẩm theo id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('productLine');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy sản phẩm theo dòng sản phẩm (customer, Farmer)
export const getProductsByProductLine = async (req, res) => {
  try {
    const { productLineId } = req.params;
    const products = await Product.find({ productLine: productLineId });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cập nhật giá sản phẩm (Farmer)
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

// Xóa sản phẩm (Farmer, Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Approve Product Line (Admin)
export const approveProductLine = async (req, res) => {
  try {
    const { id } = req.params;
    const productLine = await ProductLine.findById(id);
    if (!productLine) return res.status(404).json({ message: 'Product line not found' });

    productLine.status = 'approved';
    await productLine.save();

    res.status(200).json({ message: 'Product line approved successfully', productLine });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject Product Line (Admin)
export const rejectProductLine = async (req, res) => {
  try {
    const { id } = req.params;
    const productLine = await ProductLine.findById(id);
    if (!productLine) return res.status(404).json({ message: 'Product line not found' });

    productLine.status = 'rejected';
    await productLine.save();

    res.status(200).json({ message: 'Product line rejected successfully', productLine });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Tổng quan dashboard cho admin: tổng doanh thu, dòng sản phẩm bán chạy nhất quý này
export const getAdminOverview = async (req, res) => {
  try {
    // Tổng doanh thu (tính tổng totalPrice của các đơn hàng đã hoàn thành)
    const completedOrders = await Order.find({
      status: { $in: ['Delivered', 'Completed', 'success'] }
    });
    const revenue = completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Dòng sản phẩm bán chạy nhất quý này
    const now = new Date();
    const quarter = Math.floor((now.getMonth() + 3) / 3);
    const startOfQuarter = new Date(now.getFullYear(), (quarter - 1) * 3, 1);

    // Lấy các đơn hàng hoàn thành trong quý này
    const ordersInQuarter = completedOrders.filter(order => 
      order.createdAt >= startOfQuarter
    );

    // Gom số lượng bán theo productLine
    const productLineSales = {};
    for (const order of ordersInQuarter) {
      for (const item of order.products) {
        const product = await Product.findById(item.product).populate('productLine');
        if (product && product.productLine) {
          const lineId = product.productLine._id.toString();
          if (!productLineSales[lineId]) {
            productLineSales[lineId] = {
              name: product.productLine.name,
              totalSold: 0
            };
          }
          productLineSales[lineId].totalSold += item.quantity || 0;
        }
      }
    }
    // Tìm dòng sản phẩm bán chạy nhất
    let topProductLine = null;
    Object.values(productLineSales).forEach(line => {
      if (!topProductLine || line.totalSold > topProductLine.totalSold) {
        topProductLine = line;
      }
    });

    res.status(200).json({
      revenue,
      topProductLine
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};