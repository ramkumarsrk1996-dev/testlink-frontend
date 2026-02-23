import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Positions from "./pages/admin/Positions";
import Questions from "./pages/admin/Questions";
import Results from "./pages/admin/results";
import GenerateTest from "./pages/admin/GenerateTest";
import AssignTest from "./pages/candidate/AssignTest";
import CandidateForm from "./pages/candidate/CandidateForm";
import TestPage from "./pages/candidate/TestPage";
import Terms from "./pages/candidate/Terms";
import ThankYou from "./pages/candidate/ThankYou";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/positions" element={<Positions />} />
          <Route path="/admin/questions" element={<Questions />} />
          <Route path="/admin/generate-test" element={<GenerateTest />} />
          <Route path="/admin/results" element={<Results />} />


          {/* Candidate public route */}
          <Route path="/assign/:token" element={<AssignTest />} />
          <Route path="/candidate-info" element={<CandidateForm />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/thank-you" element={<ThankYou />} />
          



          {/* Default redirect LAST */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
