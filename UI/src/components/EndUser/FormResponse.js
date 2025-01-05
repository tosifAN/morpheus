import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChartLine, FaSpinner, FaClipboard, FaCalendarAlt, FaIdCard, FaFileAlt } from "react-icons/fa";

export default function FormResponses() {
    const [responses, setResponses] = useState([]);
    const [formId, setFormId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { formId: urlFormId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (urlFormId) {
            setFormId(parseInt(urlFormId));
        }
    }, [urlFormId]);

    useEffect(() => {
        if (formId === null) return;
        const fetchResponses = async () => {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8000/api/form_responses/${formId}`);
            const data = await response.json();

            console.log(data);
            if (response.ok) {
                if (Array.isArray(data)) {
                    setResponses(data);
                } else {
                    console.error("Expected an array but got:", data);
                }
            } else {
                console.error("Error fetching responses:", data);
            }
            setLoading(false);
        };

        fetchResponses();
    }, [formId]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white flex items-center justify-center">
                <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white p-8 relative">
            <div className="max-w-4xl mx-auto mb-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <button
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                        onClick={() => navigate(`/forms/response/analytics/${formId}`)}
                    >
                        <FaChartLine className="animate-pulse" />
                        <span>View Analytics</span>
                    </button>
                    <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                        <span className="text-lg font-semibold text-gray-700 flex items-center">
                            <FaClipboard className="mr-2 text-indigo-500" />
                            Total Responses: {responses.length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl p-8 animate-slideUp">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Form Responses
                    </h1>
                    
                    <div className="space-y-6">
                        {Array.isArray(responses) && responses.length > 0 ? (
                            responses.map((response, index) => (
                                <div
                                    key={response.id}
                                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg animate-fadeIn"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-indigo-600">
                                            Response #{index + 1}
                                        </h3>
                                        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
                                            ID: {response.id}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <FaCalendarAlt className="text-indigo-500" />
                                            <div>
                                                <p className="text-sm font-medium">Submitted At</p>
                                                <p className="text-gray-800">
                                                    {new Date(response.submitted_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <FaFileAlt className="text-indigo-500" />
                                            <div>
                                                <p className="text-sm font-medium">Form ID</p>
                                                <p className="text-gray-800">{response.form}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <FaClipboard className="mx-auto text-4xl text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg">No responses available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}