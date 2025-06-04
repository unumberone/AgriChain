import User from '../models/user.js';
import bcrypt from 'bcryptjs';

// Đăng ký user mới
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, address } = req.body;
    const existingUser = await User.findOne({ email, role });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      address
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Đăng nhập user
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Có thể thêm JWT ở đây nếu cần
    res.status(200).json({ message: 'Login successful', user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy danh sách tất cả user (chỉ cho admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy thông tin user theo id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};