import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState('farmer');
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Gửi dữ liệu đăng ký lên backend
      const res = await axios.post(`${BASE_URL}/register`, {
        ...formData,
        role
      });

      if (res.status === 201) {
        alert('Register success!');
        // Điều hướng theo role
        if (role === 'farmer') router.push('/dashboard');
        else if (role === 'customer') router.push('/customer/dashboard');
        // Bỏ điều hướng admin
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Register failed!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A4D3C] flex flex-col items-center justify-center px-4 py-12">
      <Head>
        <title>Register - AgriChain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">AgriChain</h1>
      </div>

      <h2 className="text-2xl font-semibold text-white/90 mb-8">Create your account</h2>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative">
        <Link href="/login" className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-emerald-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Login</span>
        </Link>

        <div className="mt-8 mb-6">
          <div className="flex p-1 bg-gray-100 rounded-lg gap-2">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-all duration-200 ${role === 'farmer' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Farmer
            </button>
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-all duration-200 ${role === 'customer' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Customer
            </button>
            {/* Đã bỏ nút Admin */}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
          <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
          <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-4 py-3 border rounded-lg" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3.5 px-4 rounded-lg hover:bg-emerald-600 transition duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mt-6"
          >
            Create Account as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>

          <div className="text-center pt-4 text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}