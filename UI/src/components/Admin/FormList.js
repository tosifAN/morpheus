import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaClipboardList, FaChartBar, FaSpinner } from "react-icons/fa";

export default function FormList() {
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            const response = await fetch("http://localhost:8000/api/forms/");
            const data = await response.json();
            console.log("this is hahha", data);
            if (response.ok) {
                setForms(data);
            } else {
                console.error("Error fetching forms", data);
            }
            setLoading(false);
        };
        fetchForms();
    }, []);

    const handleViewForm = (formId) => {
        navigate(`/forms/response/${formId}`); 
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-purple-50 to-white flex items-center justify-center">
                <FaSpinner className="animate-spin text-purple-500 text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-50 to-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        <FaClipboardList className="inline-block mr-3 text-purple-500" />
                        Your Created Forms
                    </h1>
                    <p className="text-gray-600">Manage and view responses to your forms</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-500 text-lg">
                                No forms created yet
                            </div>
                        </div>
                    ) : (
                        forms.map((form) => (
                            <div
                                key={form.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slideUp"
                            >
                                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                                    <h2 className="font-bold text-xl text-white truncate">
                                        {form.title}
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <p className="text-gray-600 mb-6 line-clamp-2">
                                        {form.description || "No description provided"}
                                    </p>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <FaChartBar className="text-purple-500" />
                                            <span className="text-sm text-gray-600">
                                               FormID {form.id || 0} 
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewForm(form.id)}
                                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 group"
                                    >
                                        <FaEye className="group-hover:animate-bounce" />
                                        <span>View Responses</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
