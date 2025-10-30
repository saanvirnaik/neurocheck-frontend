import React, { useState, useRef } from "react";
import { Box, Button, Stepper, Step, StepLabel, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DyslexiaScreeningForm from "./DyslexiaScreeningForm";
import WordMatchGame from "./WordMatchGame";
import PatternRecognitionGame from "./PatternRecognitionGame";

const steps = ["Checklist", "Word Match", "Pattern Recognition"];

export default function DyslexiaScreeningWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [combinedResults, setCombinedResults] = useState(null);
  const navigate = useNavigate();

  // Refs to call child save functions
  const checklistRef = useRef();
  const wordMatchRef = useRef();
  const patternRef = useRef();

 const handleNext = async () => {
     try {
       if (activeStep === 0 && checklistRef.current) {
         await checklistRef.current.saveScreeningData();
       } else if (activeStep === 1 && wordMatchRef.current) {
         await wordMatchRef.current.saveGameData();
       } else if (activeStep === 2 && patternRef.current) {
         await patternRef.current.savePatternData();
       } else {
         // If no ref is ready for the step, show error
         alert("Please complete the current step before proceeding.");
         return;
       }

       if (activeStep < steps.length - 1) {
         setActiveStep((prev) => prev + 1);
       } else {
         navigate("/results");
       }
     } catch (err) {
       console.error("Error in workflow step:", err);
       alert("Please complete the current step before proceeding.");
     }
   };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSkipToEnd = () => {
    navigate("/results", { state: { results: combinedResults } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F3F4FF 0%, #FAFAFA 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Render current step */}
          {activeStep === 0 && <DyslexiaScreeningForm ref={checklistRef} />}
          {activeStep === 1 && <WordMatchGame ref={wordMatchRef} />}
          {activeStep === 2 && <PatternRecognitionGame ref={patternRef} />}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Back
            </Button>

            <Box>
              <Button
                onClick={handleSkipToEnd}
                color="secondary"
                variant="text"
                sx={{ textTransform: "none", mr: 2 }}
              >
                Skip to Results
              </Button>

              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  textTransform: "none",
                  background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                  borderRadius: "9999px",
                  px: 4,
                }}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
