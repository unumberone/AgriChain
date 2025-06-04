import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState('farmer');
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/login`, { ...formData, role });
      const user = res.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'farmer') router.push('/dashboard');
      else if (user.role === 'customer') router.push('/customer/dashboard');
      else if (user.role === 'admin') router.push('/admin/dashboard');
      else alert('Role not supported');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
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
    <div className="min-h-screen bg-[#0A4D3C] flex flex-col items-center justify-center px-4">
      <Head>
        <title>Login - AgriChain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Logo */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">AgriChain</h1>
      </div>

      {/* Welcome Text */}
      <h2 className="text-2xl font-semibold text-white/90 mb-8">Good to see you again</h2>

      {/* Login Form Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-emerald-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Role Selector */}
        <div className="mb-6 mt-8">
          <div className="flex p-1 bg-gray-100 rounded-lg gap-2">
            <button
              onClick={() => setRole('farmer')}
              type="button"
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-all duration-200 ${role === 'farmer'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Farmer
            </button>
            <button
              onClick={() => setRole('customer')}
              type="button"
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-all duration-200 ${role === 'customer'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole('admin')}
              type="button"
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-all duration-200 ${role === 'admin'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. name@company.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Your password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white"
                required
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3.5 px-4 rounded-lg hover:bg-emerald-600 transition duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>

          {/* Links */}
          <div className="flex flex-col items-center pt-4 text-sm">
            <Link
              href="/forgot-password"
              className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              Forgot password?
            </Link>
            <span className="text-gray-600 mt-2">
              New here?
              <Link
                href="/register"
                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline ml-1"
              >
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}