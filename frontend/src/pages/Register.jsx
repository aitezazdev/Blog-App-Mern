import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/Slices/authSlice";
import { MdOutlineError, MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiLoaderAlt } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required";
    if (!data.email) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    try {
      await dispatch(registerUser(data)).unwrap();
      setData({ name: "", email: "", password: "" });
      setErrors({});
      navigate("/");
      toast.success("Registration Successful");
    } catch (err) {
      setErrors((prev) => ({ ...prev, backend: err || "Registration failed" }));
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", backend: "" }));
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-[420px]">
        <form onSubmit={handleSubmit} className="bg-zinc-900/40 rounded-xl px-8 py-10 border border-zinc-800 shadow-2xl backdrop-blur-sm transition-all duration-300">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Create Account</h3>
            <p className="text-sm text-zinc-400">Sign up to get started</p>
          </div>

          {errors.backend && (
            <div className="bg-red-950/20 border-l-4 border-red-500 text-red-300 px-4 py-2 flex items-center rounded mb-6" role="alert">
              <MdOutlineError className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
              <span className="text-xs">{errors.backend}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="w-5 h-5 text-zinc-550" />
                </div>
                <input
                  onChange={handleChange} autoComplete="off"
                  value={data.name}
                  className="w-full pl-10 py-2.5 px-4 text-sm text-zinc-100 bg-zinc-950/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineEmail className="w-5 h-5 text-zinc-550" />
                </div>
                <input autoComplete="off"
                  onChange={handleChange}
                  value={data.email}
                  className="w-full pl-10 py-2.5 px-4 text-sm text-zinc-100 bg-zinc-950/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@agency.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="w-5 h-5 text-zinc-550" />
                </div>
                <input autoComplete="off"
                  onChange={handleChange}
                  value={data.password}
                  className="w-full pl-10 py-2.5 px-4 text-sm text-zinc-100 bg-zinc-950/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 rounded-lg text-zinc-950 font-semibold transition-all hover:bg-white bg-zinc-100 hover:scale-[1.01] active:scale-[0.99] text-sm focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 cursor-pointer">
              {loading ? (
                <span className="flex items-center">
                  <BiLoaderAlt className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
