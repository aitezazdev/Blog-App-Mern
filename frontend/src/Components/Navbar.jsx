import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/Slices/authSlice";
import { toast } from "react-toastify";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logout Successful");
    setMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 text-white bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
            ZazBlog<span className="text-orange-600">.</span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors py-1 ${
                  isActive ? "text-orange-600 border-b-2 border-zinc-800" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors py-1 ${
                  isActive ? "text-orange-600 border-b-2 border-zinc-800" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors py-1 ${
                  isActive ? "text-orange-600 border-b-2 border-zinc-800" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              Contact
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/saved-posts"
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors py-1 ${
                      isActive ? "text-orange-600 border-b-2 border-zinc-800" : "text-zinc-400 hover:text-white"
                    }`
                  }
                >
                  Saved Posts
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Logout
                </button>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => 
                    `w-8 h-8 rounded-full bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-100 text-xs font-semibold tracking-wide transition-all hover:scale-105 hover:border-zinc-800 ${
                      isActive ? "ring-2 ring-orange-600/50 border-zinc-800" : ""
                    }`
                  }
                  title={user?.name || "Profile"}
                >
                  {getInitials(user?.name)}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors py-1 ${
                      isActive ? "text-orange-600 border-b-2 border-zinc-800" : "text-zinc-400 hover:text-white"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => 
                    `px-4 py-2 text-sm font-medium rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98]`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(true)} className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-zinc-950/95 border-l border-zinc-900 backdrop-blur-lg z-50 p-6 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <div className="flex flex-col space-y-6 mt-12">
          <NavLink 
            to="/" 
            onClick={() => setMenuOpen(false)} 
            className={({ isActive }) => 
              `text-base font-medium transition-colors ${isActive ? "text-orange-600" : "text-zinc-300 hover:text-white"}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            onClick={() => setMenuOpen(false)} 
            className={({ isActive }) => 
              `text-base font-medium transition-colors ${isActive ? "text-orange-600" : "text-zinc-300 hover:text-white"}`
            }
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            onClick={() => setMenuOpen(false)} 
            className={({ isActive }) => 
              `text-base font-medium transition-colors ${isActive ? "text-orange-600" : "text-zinc-300 hover:text-white"}`
            }
          >
            Contact
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/saved-posts"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => 
                  `text-base font-medium transition-colors ${isActive ? "text-orange-600" : "text-zinc-300 hover:text-white"}`
                }
              >
                Saved Posts
              </NavLink>
              <button onClick={handleLogout} className="text-base font-medium text-zinc-300 hover:text-white text-left cursor-pointer">
                Logout
              </button>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => 
                  `text-base font-medium transition-colors ${isActive ? "text-orange-600" : "text-zinc-300 hover:text-white"}`
                }
              >
                Profile ({user.name})
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => 
                  `text-base font-medium transition-colors ${isActive ? "text-orange-600" : "text-zinc-300 hover:text-white"}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-center text-sm font-medium rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div className="pt-20"></div>
    </>
  );
};

export default Navbar;