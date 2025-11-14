import React from "react";
import {
  User,
  Heart,
  Star,
  Settings,
  Bell,
  LogOut,
  Edit2,
} from "lucide-react";
import Header from "@/components/header"

export default function SettingsPage() {
  return (
    <div className="flex-1 min-h-screen">
      {/* Main Content */}
      <Header />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full shadow hover:bg-blue-600">
                <Edit2 size={14} className="text-white" />
              </button>
            </div>
            <h2 className="mt-4 text-lg font-semibold">Sara Tancredi</h2>
            <p className="text-gray-500 text-sm">New York, USA</p>
          </div>

          {/* Form */}
          <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Name" value="Sara" />
            <InputField label="Full Name" value="Tancredi" />
            <InputField label="Email Address" value="SaraTancredi@gmail.com" />
            <InputField label="Phone Number" value="(+98) 9123728167" />
            <InputField label="Location" value="e.g. New York, USA" />
            <InputField label="Postal Code" value="23728167" />
          </form>

          {/* Save Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium shadow hover:from-blue-600 hover:to-blue-500 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Nav Item
function NavItem({ icon, text, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-blue-50 text-blue-500"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

// Reusable Input Field
function InputField({ label, value }) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        defaultValue={value}
        className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
