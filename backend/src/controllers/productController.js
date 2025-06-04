import ProductLine from '../models/productLine.js';
import Product from '../models/product.js';
import QRCode from "qrcode";

// Đăng ký dòng sản phẩm mới
export const createProductLine = async (req, res) => {
  try {
    const { name, location, cultivationProcess, packagingUnit, certifications, harvestDate, batchId, image } = req.body;
    const farmer = req.user?._id || req.body.farmer;

    const existingBatch = await ProductLine.findOne({ batchId });
    if (existingBatch) return res.status(400).json({ message: 'Batch ID already exists' });

    // Tạo trước productLine để lấy _id
    const productLine = new ProductLine({
      name,
      farmer,
      location,
      cultivationProcess,
      packagingUnit,
      certifications,
      harvestDate,
      batchId,
      transportationRoute: req.body.transportationRoute || '',
      image: image,
      status: 'pending'
    });
    await productLine.save();

    // Tạo QR code dẫn đến trang chi tiết dòng sản phẩm
    const frontendUrl = process.env.FRONTEND_URL;
    const detailUrl = `${frontendUrl}/myProducts/productLineDetail/${productLine._id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(detailUrl);

    // Lưu QR vào productLine
    productLine.qrCode = qrCodeDataUrl;
    await productLine.save();

    res.status(201).json({ message: 'Product line registered', productLine });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Lấy danh sách dòng sản phẩm (có thể lọc theo farmer)
export const getProductLines = async (req, res) => {
  try {
    const { farmer, role } = req.body;
    let filter = {};
    if (role == 'farmer') {
      filter.farmer = farmer;
    }
    const productLines = await ProductLine.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ productLines });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProductLineDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productLine = await ProductLine.findById(id).populate('farmer', 'name email');
    if (!productLine) return res.status(404).json({ message: 'Product line not found' });

    res.status(200).json({ productLine});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
// Thêm sản phẩm mới (theo product line đã duyệt)
export const createProduct = async (req, res) => {
  try {
    const { name, quantity, unit, price, farmer, productLine } = req.body;

    // Kiểm tra productLine đã được duyệt chưa
    const line = await ProductLine.findById(productLine);
    if (!line) return res.status(404).json({ message: 'Product line not found' });
    if (line.status !== 'approved') return res.status(400).json({ message: 'Product line is not approved' });

    const product = new Product({
      name,
      quantity,
      unit,
      price,
      farmer,
      productLine,
      image: line.image // lấy ảnh từ product line nếu có
    });
    await product.save();

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy danh sách sản phẩm (lọc theo farmer nếu có)
export const getProducts = async (req, res) => {
  try {
    const { farmer } = req.body;
    let filter = {};
    if (farmer) filter.farmer = farmer;
    const products = await Product.find(filter).populate('productLine', 'name batchId').sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xóa sản phẩm
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

// Cập nhật số lượng sản phẩm
export const updateProductQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.quantity = quantity;
    await product.save();
    res.status(200).json({ message: 'Quantity updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};