import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserById } from '../controllers/userController.js';
import { addProductToLine, updateProductPrice, getFarmerOverview } from '../controllers/farmerController.js';
import {
    getProductLines, createProductLine, getProductLineDetail, getProducts,
    createProduct,
    deleteProduct,
    updateProductQuantity
} from '../controllers/productController.js';
import { approveProductLine, rejectProductLine, getAdminOverview } from '../controllers/adminController.js';
import {
    searchProducts,
    getProductLineByBatchId,
    checkout,
    getOrderHistory,
    getAllProducts,
    addToCart,
    getCart,
    removeFromCart
} from '../controllers/customerController.js';

const router = express.Router();

// User
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Farmer
router.post('/products', addProductToLine);
router.put('/products/:id/price', updateProductPrice);
router.get('/farmer/overview/:farmerId', getFarmerOverview);

// Admin
// router.get('/admin/product-lines', getAllProductLines);
router.post('/admin/product-lines/approve/:id', approveProductLine);
router.post('/admin/product-lines/reject/:id', rejectProductLine);
router.get('/admin/overview', getAdminOverview); // Thêm dòng này

// Customer/customer
router.get('/search', searchProducts);
router.get('/product-line/:batchId', getProductLineByBatchId);
router.post('/checkout', checkout);
router.get('/orders/:customerId', getOrderHistory);

// --- Thêm các route cho shop/customer ---
router.get('/products/listAll', getAllProducts); // Lấy tất cả sản phẩm cho shop
router.post('/customers/cart/add', addToCart); // Thêm vào giỏ hàng
router.get('/customers/cart/:customerId', getCart); // Lấy giỏ hàng của user
router.post('/customers/cart/remove', removeFromCart); // Xóa sản phẩm khỏi giỏ hàng

// Product Lines
router.post('/product-lines/list', getProductLines);
router.post('/product-lines/create', createProductLine);
router.get('/product-lines/detail/:id', getProductLineDetail);

// Product
router.post('/products/list', getProducts); // Lấy danh sách sản phẩm
router.post('/products/create', createProduct); // Thêm sản phẩm mới (chỉ cho phép nếu product line đã duyệt)
router.delete('/products/delete/:id', deleteProduct); // Xóa sản phẩm
router.put('/products/update-quantity/:id', updateProductQuantity); // Cập nhật số lượng sản phẩm

export default router;