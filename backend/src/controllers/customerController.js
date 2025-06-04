import Product from '../models/product.js';
import ProductLine from '../models/productLine.js';
import Order from '../models/order.js';
import User from '../models/user.js'; // Dùng User thay cho Customer

// Tìm kiếm và xem thông tin sản phẩm
export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;
    const query = keyword
      ? { name: { $regex: keyword, $options: 'i' }, status: 'approved' }
      : { status: 'approved' };
    const products = await Product.find(query).populate('productLine');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xem thông tin sản phẩm theo mã QR (batchId)
export const getProductLineByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const productLine = await ProductLine.findOne({ batchId }).populate('farmer');
    if (!productLine) return res.status(404).json({ message: 'Product line not found' });

    // Lấy các sản phẩm thuộc dòng sản phẩm này
    const products = await Product.find({ productLine: productLine._id, status: 'approved' });

    res.status(200).json({
      productLine,
      products
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy tất cả sản phẩm cho shop (có thể lọc theo status, tags, ...)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Thêm sản phẩm vào giỏ hàng (lưu vào User)
export const addToCart = async (req, res) => {
  try {
    const { customer, product, quantity } = req.body;
    if (!customer || !product || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const userDoc = await User.findById(customer);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    // Lấy thông tin sản phẩm hiện tại
    const productDoc = await Product.findById(product);
    if (!productDoc) return res.status(404).json({ message: 'Product not found' });

    if (!userDoc.cart) userDoc.cart = [];

    // Kiểm tra nếu đã có sản phẩm thì cập nhật số lượng, nếu chưa thì thêm mới
    const existingIndex = userDoc.cart.findIndex(item => item.product.toString() === product);
    console.log(existingIndex)
    if (existingIndex !== -1) {
      // Nếu số lượng mới <= 0 thì xóa khỏi giỏ hàng
      const newQuantity = Number(userDoc.cart[existingIndex].quantity) + Number(quantity);
      if (newQuantity <= 0) {
        userDoc.cart.splice(existingIndex, 1);
      } else {
        userDoc.cart[existingIndex].quantity = newQuantity;
        // Cập nhật tên và giá mới nhất
        userDoc.cart[existingIndex].name = productDoc.name;
        userDoc.cart[existingIndex].price = productDoc.price;
      }
    } else {
      // Nếu số lượng thêm vào <= 0 thì không thêm
      if (Number(quantity) > 0) {
        userDoc.cart.push({
          product,
          quantity: Number(quantity),
          name: productDoc.name,
          price: productDoc.price
        });
      }
    }
    userDoc.markModified('cart')
    await userDoc.save();

    // Trả về giỏ hàng mới nhất
    await userDoc.populate('cart.product');
    res.status(200).json({ message: 'Added to cart', cart: userDoc.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy giỏ hàng của user
export const getCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    const userDoc = await User.findById(customerId);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    const cart = await Promise.all(
      (userDoc.cart || []).map(async (item) => {
        const productDoc = await Product.findById(item.product);
        return {
          product: item.product,
          quantity: item.quantity,
          name: item.name || productDoc?.name,
          price: item.price || productDoc?.price,
          unit: productDoc?.unit,
          image: productDoc?.image,
          availableQuantity: productDoc?.quantity ?? 0
        };
      })
    );

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  try {
    const { customer, product } = req.body;
    const userDoc = await User.findById(customer);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });
    userDoc.cart = (userDoc.cart || []).filter(item => item.product.toString() !== product);
    console.log(userDoc.cart)
    await userDoc.save();
    res.status(200).json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Thanh toán (tạo đơn hàng, trừ kho, xóa giỏ hàng)
export const checkout = async (req, res) => {
  try {
    const { customer, cart } = req.body; // cart: [{ product, quantity }]
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Please add products to cart' });
    }

    let totalPrice = 0;
    const orderProducts = [];

    for (const item of cart) {
      // Lấy thông tin sản phẩm hiện tại
      const productDoc = await Product.findById(item.product);
      if (!productDoc || productDoc.quantity < item.quantity) {
        console.log(item.product, productDoc)
        return res.status(400).json({ message: `Not enough quantity for: ${productDoc?.name || 'Unknown'}` });
      }
      totalPrice += productDoc.price * item.quantity;
      orderProducts.push({
        product: productDoc._id,
        quantity: item.quantity,
        price: productDoc.price,
        name: productDoc.name, // Lưu tên tại thời điểm mua,
        unit: productDoc.unit,
      });
      // Trừ số lượng tồn kho
      productDoc.quantity -= item.quantity;
      await productDoc.save();
    }

    const order = new Order({
      customer,
      products: orderProducts, // mỗi item có {product, quantity, price, name}
      totalPrice,
      status: 'success'
    });
    await order.save();

    // Xóa giỏ hàng sau khi thanh toán
    const userDoc = await User.findById(customer);
    if (userDoc) {
      userDoc.cart = [];
      await userDoc.save();
    }

    res.status(200).json({ message: 'Checkout successful', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lịch sử mua hàng
export const getOrderHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customer: customerId }).populate('products.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};