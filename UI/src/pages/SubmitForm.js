import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner, FaPaperPlane, FaClipboardList, FaCheck, FaExclamationCircle } from "react-icons/fa";

const FormSubmitPage = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formId, setFormId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { formId: urlFormId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (urlFormId) {
      setFormId(parseInt(urlFormId));
    }
  }, [urlFormId]);

  useEffect(() => {
    if (!formId) return;

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/form_questions/${formId}/`
        );
        const data = await response.json();

        if (response.ok) {
          setQuestions(data);
        } else {
          throw new Error(data.detail || "Failed to fetch questions");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [formId]);

  const handleInputChange = (questionId, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const answers = Object.keys(formData).map((questionId) => ({
        question: questionId,
        text_answer: formData[questionId],
      }));

      const response = await fetch(`http://127.0.0.1:8000/api/responses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form: formId,
          answers,
        }),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        navigate("/admin");
        setFormData({});
      } else {
        const errorDetails = await response.json();
        throw new Error(JSON.stringify(errorDetails));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error submitting form: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg animate-fadeIn">
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FaClipboardList className="mr-3" />
                Form Submission
              </h1>
              {submitting && (
                <FaSpinner className="animate-spin text-white text-xl" />
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {questions.map((question) => (
              <div
                key={question.order}
                className="bg-gray-50 rounded-xl p-6 transform hover:scale-[1.02] transition-all duration-300 animate-fadeIn"
              >
                <label className="block text-lg font-medium text-gray-700 mb-4">
                  {question.text}
                </label>

                {question.question_type === "text" && (
                  <input
                    type="text"
                    value={formData[question.id] || ""}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your answer"
                  />
                )}

                {question.question_type === "dropdown" && (
                  <select
                    value={formData[question.id] || ""}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select an option</option>
                    {Array.isArray(question.options) &&
                      question.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                )}

                {question.question_type === "checkbox" && (
                  <div className="space-y-3">
                    {Array.isArray(question.options) &&
                      question.options.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <input
                            type="checkbox"
                            value={option}
                            checked={
                              formData[question.id]?.includes(option) || false
                            }
                            onChange={(e) => {
                              const currentValues = formData[question.id] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option]
                                : currentValues.filter((val) => val !== option);
                              handleInputChange(question.id, newValues);
                            }}
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  <span>Submit Form</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormSubmitPage;
