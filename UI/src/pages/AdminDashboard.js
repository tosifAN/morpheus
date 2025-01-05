import React from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaPlusSquare, FaEdit } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold tracking-wider">
            <span className="animate-pulse">Admin</span> Dashboard
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/admin/buildform">
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-transparent hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <div className="relative z-10">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaPlusSquare className="text-blue-600 text-2xl transform group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Create Form</h2>
                <p className="text-gray-600">
                  Design and configure a new form for users to respond to.
                </p>
              </div>
            </div>
          </Link>

          <Link to="/formlist">
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-transparent hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <div className="relative z-10">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaClipboardList className="text-blue-600 text-2xl transform group-hover:translate-y-1 transition-transform duration-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">View Forms</h2>
                <p className="text-gray-600">
                  Browse and manage all forms.
                </p>
              </div>
            </div>
          </Link>

          <Link to="/fillform">
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-transparent hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <div className="relative z-10">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaEdit className="text-blue-600 text-2xl transform group-hover:-rotate-12 transition-transform duration-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Respond to a Form</h2>
                <p className="text-gray-600">
                  Wanna? to fill a Form?.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
