import React, { useState, useEffect } from "react";
import {
  UserIcon,
  LogOutIcon,
  Edit2Icon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile,logout } from "../services/authservice";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await getProfile();

      if (res.success) {
        const info = res.user;
        console.log("info: ", info.name);
        setUser(info);
        setForm({
          name: info.name,
          email: info.email,
          phone: info.phone,
          password: "",
        });
      } else {
        setError("Failed to load profile");
        handleLogout()
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = { name: form.name, email: form.email, phone: form.phone };
    if (form.password.trim() !== "") payload.password = form.password;

    const res = await updateProfile(payload);

    if (res.success) {
      setSuccess("Profile updated successfully!");
      setUser(res.data.user);
      setEditMode(false);
    } else {
      setError(res.message || "Failed to update profile");
    }

    setSaving(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-green-700" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gray-400 mt-[100px] text-white py-10 rounded-lg shadow-lg relative">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-[#8CA566]" />
          </div>
          <h2 className="text-2xl font-bold mt-3">{user.name}</h2>
          <p className="text-sm opacity-80 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mt-8 px-5">
        {!editMode ? (
          <div className="space-y-5">
            <ProfileItem icon={<MailIcon />} label="Email" value={user.email} />
            <ProfileItem
              icon={<PhoneIcon />}
              label="Phone"
              value={user.phone}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 bg-[#8CA566] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-800 transition"
              >
                <Edit2Icon className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-300 transition"
              >
                <LogOutIcon className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-lg shadow p-5 space-y-5"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Edit Profile
            </h3>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <InputField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <PasswordField
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#8CA566] text-white py-3 rounded-lg font-semibold  transition flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="animate-spin w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Components
const ProfileItem = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <h3 className="text-gray-600 font-semibold mb-3 flex items-center gap-2">
      <span className="text-[#8CA566]">{icon}</span> {label}
    </h3>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600"
    />
  </div>
);

const PasswordField = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Change Password
    </label>
    <div className="flex items-center border rounded-lg p-3">
      <LockIcon className="w-4 h-4 text-gray-400 mr-2" />
      <input
        type="password"
        name="password"
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        className="flex-1 focus:outline-none"
      />
    </div>
  </div>
);

export default Profile;
