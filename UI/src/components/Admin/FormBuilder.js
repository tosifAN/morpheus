import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaQuestionCircle, FaSave, FaTrash } from "react-icons/fa";

function FormBuilder() {
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        question_type: "text",
        options: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const addQuestion = () => {
        if (newQuestion.text.trim() !== "") {
            setQuestions([...questions, { ...newQuestion }]);
            setNewQuestion({ text: "", question_type: "text", options: [] });
        }
    };

    const saveForm = async () => {
        const formData = {
            title: formTitle,
            description: formDescription,
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            // Save form
            const formResponse = await fetch("http://localhost:8000/api/forms/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (formResponse.ok) {
                const formResult = await formResponse.json();

                // Save questions
                if (questions.length > 0) {
                    const questionsWithFormId = questions.map((q, idx) => ({
                        ...q,
                        form: formResult.id,
                        order: idx + 1,
                    }));

                    console.log("this is questions : ", questionsWithFormId);
                    const questionsResponse = await fetch("http://localhost:8000/api/questions/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(questionsWithFormId),
                    });

                    if (questionsResponse.ok) {
                        alert("Form and questions saved successfully!");
                        navigate("/");
                    } else {
                        console.error(await questionsResponse.json());
                        alert("Form saved but failed to save questions.");
                    }
                } else {
                    alert("Form saved successfully!");
                    navigate("/");
                }
            } else if (formResponse.status === 401) {
                navigate("/login");
            } else {
                console.error(await formResponse.json());
                alert("Failed to save form.");
            }
        } catch (error) {
            console.error("Error saving form:", error);
            alert("An error occurred.");
        }
    };

    const handleAddOption = (option) => {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, option],
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
                        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Create Your Form
                        </h1>

                        <div className="mb-6 group">
                            <label className="block text-gray-700 font-medium mb-2 group-hover:text-blue-600 transition-colors">
                                Form Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter an engaging title"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-gray-700 font-medium mb-2 group-hover:text-blue-600 transition-colors">
                                Description
                            </label>
                            <textarea
                                placeholder="Describe your form's purpose"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                rows={4}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300 resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <FaQuestionCircle className="text-blue-500" />
                            Add New Question
                        </h2>
                        
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Type your question here..."
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            />

                            <select
                                value={newQuestion.question_type}
                                onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 cursor-pointer"
                            >
                                <option value="text">Text Response</option>
                                <option value="checkbox">Multiple Choice</option>
                                <option value="dropdown">Dropdown Selection</option>
                            </select>

                            {newQuestion.question_type !== "text" && (
                                <div className="bg-gray-50 rounded-lg p-4 animate-fadeIn">
                                    <input
                                        type="text"
                                        placeholder="Add option and press Enter"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && e.target.value.trim() !== "") {
                                                handleAddOption(e.target.value);
                                                e.target.value = "";
                                            }
                                        }}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {newQuestion.options.map((option, idx) => (
                                            <span
                                                key={idx}
                                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium animate-scaleIn flex items-center gap-2 hover:bg-blue-200 transition-colors"
                                            >
                                                {option}
                                                <button
                                                    onClick={() => {
                                                        const newOptions = newQuestion.options.filter((_, i) => i !== idx);
                                                        setNewQuestion({ ...newQuestion, options: newOptions });
                                                    }}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={addQuestion}
                                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 group"
                            >
                                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                                Add Question
                            </button>
                        </div>
                    </div>

                    {questions.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Added Questions</h2>
                            <div className="space-y-4">
                                {questions.map((q, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 border border-blue-100 bg-blue-50 rounded-lg hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-blue-600 font-bold">Q{idx + 1}.</span>
                                                <span className="ml-2 text-gray-800">{q.text}</span>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                                {q.question_type}
                                            </span>
                                        </div>
                                        {q.options && q.options.length > 0 && (
                                            <div className="mt-2 ml-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {q.options.map((option, optIdx) => (
                                                        <span
                                                            key={optIdx}
                                                            className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm border border-gray-200"
                                                        >
                                                            {option}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={saveForm}
                        className="w-full bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-[1.02]"
                    >
                        <FaSave className="group-hover:rotate-12 transition-transform duration-300" />
                        Save Form
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormBuilder;
