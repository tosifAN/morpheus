import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { FaChartBar, FaChartPie, FaSpinner, FaClipboardList, FaExclamationCircle } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Analytics(props) {
    const { formId } = props;
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const response = await fetch(`http://localhost:8000/api/response_analytics/${formId}/`);
            const data = await response.json();
            if (response.ok) {
                setAnalytics(data);
            } else {
                console.error("Error fetching analytics", data);
            }
            setLoading(false);
        };
        if (formId) {
            fetchAnalytics();
        }
    }, [formId]);

    const generateChartData = (data, type) => {
        const labels = data.map((item) =>
            type === "checkbox"
                ? item.combination.join(" + ")
                : item.word || item.option
        );
        const counts = data.map((item) => item.count);
        return {
            labels,
            datasets: [
                {
                    label: "Responses",
                    data: counts,
                    backgroundColor: [
                        "rgba(99, 102, 241, 0.8)", // indigo-500
                        "rgba(139, 92, 246, 0.8)", // violet-500
                        "rgba(168, 85, 247, 0.8)", // purple-500
                        "rgba(217, 70, 239, 0.8)", // fuchsia-500
                        "rgba(236, 72, 153, 0.8)", // pink-500
                        "rgba(244, 63, 94, 0.8)", // rose-500
                    ],
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    borderWidth: 2,
                },
            ],
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center">
                <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
                        <FaChartBar className="mr-4 text-indigo-600" />
                        Form Analytics Dashboard
                    </h1>

                    {analytics ? (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-6 border-b border-gray-200 pb-2">
                                Response Insights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Object.entries(analytics).map(([questionId, questionData]) => {
                                    const { type, data } = questionData;
                                    const chartData =
                                        type === "text"
                                            ? data.top_words
                                            : type === "dropdown"
                                            ? data.top_options
                                            : type === "checkbox"
                                            ? data.top_combos
                                            : null;

                                    return (
                                        <div
                                            key={questionId}
                                            className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 animate-slideUp"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="font-semibold text-lg text-gray-700">
                                                    Question {questionId}
                                                </h4>
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                                                    {type}
                                                </span>
                                            </div>

                                            {chartData && chartData.length > 0 ? (
                                                <div className="relative">
                                                    {type === "text" && (
                                                        <div className="h-64">
                                                            <Bar
                                                                data={generateChartData(chartData, type)}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                    plugins: {
                                                                        legend: {
                                                                            display: false,
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {type === "dropdown" && (
                                                        <div className="h-64">
                                                            <Pie
                                                                data={generateChartData(chartData, type)}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {type === "checkbox" && (
                                                        <div className="h-64">
                                                            <Bar
                                                                data={generateChartData(data.top_combos, type)}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                    plugins: {
                                                                        legend: {
                                                                            display: false,
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {data.others > 0 && (
                                                        <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                                                            Other responses: {data.others}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                                                    <FaExclamationCircle className="text-gray-400 text-3xl mb-2" />
                                                    <p className="text-gray-500">No data available</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-4" />
                            <p className="text-gray-600">Loading analytics...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
