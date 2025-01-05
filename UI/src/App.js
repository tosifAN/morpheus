import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitForm from "./pages/SubmitForm";
import AnalyticsPage from "./pages/AnalyticsPage";
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import Home from "./pages/Home";
import Login from "./authentication/login";
import AdminDashboard from "./pages/AdminDashboard";
import FormBuilder from "./components/Admin/FormBuilder";
import FormResponses from "./components/EndUser/FormResponse";
import FormList from "./components/Admin/FormList";
import './index.css';
import FormPage from "./pages/navtorespond";
import FormSubmitPage from "./pages/SubmitForm";

const App = () => {
  return (
    <Router basename="/">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit-form" element={<SubmitForm />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/buildform" element={<FormBuilder />} />
          <Route path="/forms/response/analytics/:formId" element={<AnalyticsPage />} />
          <Route path="/forms/response/:formId" element={<FormResponses />} />
          <Route path="/formlist" element={<FormList />} />
          <Route path="/fillform" element={<FormPage />} />
          <Route path="/fillform/:formId" element={<FormSubmitPage />} />
        </Routes>
      </div>
      <Footer /> 
    </Router>
  );
};

export default App;