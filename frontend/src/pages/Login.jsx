import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/Slices/authSlice";
import { MdOutlineError, MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    try {
      await dispatch(loginUser(data)).unwrap();
      setData({ email: "", password: "" });
      setErrors({});
      navigate("/");
      toast.success("Login Successful");
    } catch (error) {
      setErrors((prev) => ({ ...prev, backend: error || "Login failed" }));
      toast.error("Login failed, please try again");
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
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome back</h3>
            <p className="text-sm text-zinc-400">Sign in to access your dashboard</p>
          </div>

          {errors.backend && (
            <div className="bg-red-950/20 border-l-4 border-red-500 text-red-300 px-4 py-2 flex items-center rounded mb-6" role="alert">
              <MdOutlineError className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
              <span className="text-xs">{errors.backend}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineEmail className="w-5 h-5 text-zinc-550" />
                </div>
                <input autoComplete="off"
                  onChange={handleChange}
                  value={data.email}
                  className="w-full pl-10 py-2.5 px-4 text-sm text-zinc-100 bg-zinc-950/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600/25 focus:border-zinc-800 transition-all duration-200"
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
                  className="w-full pl-10 py-2.5 px-4 text-sm text-zinc-100 bg-zinc-950/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600/25 focus:border-zinc-800 transition-all duration-200"
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
              className="w-full cursor-pointer flex justify-center py-2.5 px-4 rounded-lg text-zinc-950 font-semibold transition-all hover:bg-white bg-zinc-100 hover:scale-[1.01] active:scale-[0.99] text-sm focus:ring-2 focus:ring-orange-600/20 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center">
                  <BiLoaderAlt className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-600 hover:text-orange-500 font-semibold transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
