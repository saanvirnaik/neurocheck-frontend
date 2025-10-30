import './css/App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ScreeningOptions from "./components/ScreeningOptions";
import DyslexiaScreeningWorkflow from "./components/DyslexiaScreeningWorkflow";
import DyslexiaConsentForm from "./components/DyslexiaConsentForm";
import ADHDScreeningForm from "./components/ADHDScreeningForm";
import AutismScreeningForm from "./components/AutismScreeningForm";
import ResultPage from "./components/ResultPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/screening-options" element={<ScreeningOptions />} />
        <Route path="/dyslexia-consent" element={<DyslexiaConsentForm />} />
        <Route path="/dyslexia" element={<DyslexiaScreeningWorkflow />} />
        <Route path="/adhd" element={<ADHDScreeningForm />} />
        <Route path="/autism" element={<AutismScreeningForm />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
  );
}

export default App;
