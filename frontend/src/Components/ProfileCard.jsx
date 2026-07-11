import React, { useState, useEffect } from "react";
import { UserCircle, Edit2, Save, X, Trash2, Loader } from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/Slices/authSlice";

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        if (response.success) {
          setProfile(response.data);
          setFormData({
            name: response.data.name || "",
            bio: response.data.bio || "",
          });
        } else {
          setError(response.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await updateUserProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setEditing(false);
      } else {
        setError(response.message || "Update failed");
      }
    } catch (err) {
      setError(err.message || "Update request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteUserAccount();
      dispatch(logout());
      navigate("/register");
    } catch (err) {
      console.error("Account deletion failed:", err);
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      handleDeleteAccount();
    }
  };

  const renderLoadingState = () => (
    <div className="min-h-screen pt-20 bg-zinc-950 flex flex-col justify-center items-center">
      <Loader size={40} className="text-orange-600 animate-spin" />
      <p className="text-zinc-400 text-sm mt-4">Loading profile...</p>
    </div>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (error)
    return (
      <div className="bg-red-950/20 border border-red-900 rounded-lg p-6 text-center text-red-400 max-w-md mx-auto mt-24">
        <p className="text-sm">{error}</p>
      </div>
    );

  if (!profile)
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-6 text-center text-zinc-400 max-w-md mx-auto mt-24">
        No profile data available
      </div>
    );

  return (
    <div className="bg-zinc-900/40 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl mx-auto mt-12 text-zinc-100 border border-zinc-800 backdrop-blur-sm">
      {}
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-800 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4 sm:mb-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            getInitials(profile.name)
          )}
        </div>
        <div className="sm:ml-5 text-center sm:text-left w-full">
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="text-xl font-semibold bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-800 focus:ring-2 focus:ring-orange-600/25 text-white w-full px-3 py-1.5"
              placeholder="Your name"
            />
          ) : (
            <h2 className="text-2xl font-semibold tracking-tight">{profile.name}</h2>
          )}
          <p className="text-zinc-400 flex items-center justify-center sm:justify-start mt-2 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            {profile.email}
          </p>
        </div>
      </div>

      {}
      <div className="mt-6 bg-zinc-900/60 border border-zinc-800 rounded-lg p-5">
        <h3 className="font-medium text-zinc-300 flex items-center mb-3 text-sm uppercase tracking-wider">
          <UserCircle size={18} className="mr-2 text-orange-600" />
          About
        </h3>
        {editing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 resize-none focus:outline-none focus:border-zinc-800 focus:ring-2 focus:ring-orange-600/25 text-gray-100 text-sm"
            rows="4"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="mt-2 text-zinc-300 leading-relaxed text-sm">
            {profile.bio || "No bio available"}
          </p>
        )}
      </div>

      {}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
          <p className="text-2xl font-bold text-orange-600">
            {profile.createdPosts.length}
          </p>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
            Posts
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
          <p className="text-2xl font-bold text-orange-600">
            {profile.savedPosts.length}
          </p>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
            Saved
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 flex flex-col justify-center">
          <p className="text-sm font-semibold text-zinc-300">
            {new Date(profile.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </p>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
            Joined
          </p>
        </div>
      </div>

      {}
      <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row justify-between gap-4">
        {editing ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center transition disabled:opacity-50 cursor-pointer">
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-zinc-800 text-zinc-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-700 flex items-center justify-center border border-zinc-800 transition cursor-pointer">
              <X size={16} className="mr-2" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-zinc-800 text-zinc-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-700 flex items-center justify-center border border-zinc-800 transition cursor-pointer">
            <Edit2 size={16} className="mr-2" />
            Edit Profile
          </button>
        )}

        <button
          onClick={confirmDelete}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-300 flex items-center justify-center text-sm transition disabled:opacity-50 cursor-pointer">
          <Trash2 size={16} className="mr-1.5" />
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
