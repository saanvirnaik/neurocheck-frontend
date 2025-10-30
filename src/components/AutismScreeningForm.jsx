import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveDyslexiaChecklist } from "../services/apiService";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const AutismScreeningForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    childName: "",
    age: "",
    evaluatorName: "",
    evaluationDate: "",
  });
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  const autismQuestions = [
    { key: "interestInOthers", label: "Shows interest in other children" },
    { key: "pretendPlay", label: "Engages in pretend play (e.g., talking on the phone, feeding a doll)" },
    { key: "pointToShowInterest", label: "Points with index finger to show interest in something" },
    { key: "bringsObjectsToShow", label: "Brings toys or objects to share or show you" },
    { key: "responseToName", label: "Responds when called by name" },
    { key: "eyeContact", label: "Smiles back when you smile" },
    { key: "followGaze", label: "Looks in the direction you are looking" },
    { key: "interestInFaces", label: "Enjoys looking at people’s faces" },
    { key: "gestures", label: "Uses gestures such as waving or nodding" },
    { key: "understandsInstructions", label: "Understands simple instructions" },
    { key: "imitatesActions", label: "Imitates actions like clapping or making faces" },
    { key: "walks", label: "Walks independently" },
    { key: "looksAtObjectsShown", label: "Looks at things you point to across the room" },
    { key: "playsWithVariety", label: "Plays with different types of toys or games" },
    { key: "fingerMovements", label: "Makes repetitive finger or hand movements near eyes" },
    { key: "sensitiveToNoise", label: "Seems sensitive to loud or certain noises" },
    { key: "mobilityConcerns", label: "Walks on tiptoes often" },
    { key: "hearingConcerns", label: "Appears to hear normally" },
    { key: "understandingFeelings", label: "Tries to comfort others when they are upset" },
    { key: "interestInActivities", label: "Shows curiosity about new places or activities" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = { category: "Autism", ...formData, ...responses };
      const result = await saveDyslexiaChecklist(dataToSubmit);
      navigate("/result", { state: result });
    } catch (err) {
      console.error("Error submitting screening:", err);
      alert("There was an issue submitting your form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #E3F2FD 0%, #F8FBFF 60%, #FFFFFF 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative" }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={handleBack}
          sx={{
            mb: 2,
            textTransform: "none",
            color: "text.primary",
            borderRadius: 3,
            fontWeight: 500,
            "&:hover": { backgroundColor: "#f1f1f1" },
          }}
        >
          Back to Selection
        </Button>

        {/* Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 1 }}
        >
          Social & Communication Development Checklist
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          A short, observation-based tool to notice how your child connects,
          communicates, and explores.
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "text.secondary", mb: 4 }}
        >
          Every child grows and learns in their own way. These questions help
          parents and teachers observe social and communication milestones — not
          to diagnose, but to guide support if needed.
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backgroundColor: "#ffffff",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Child Info */}
            <Box
              sx={{
                backgroundColor: "#f0f6fb",
                borderRadius: 2,
                px: 2,
                py: 1,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Child Information
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Child Name"
                  name="childName"
                  fullWidth
                  required
                  value={formData.childName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Age (months)"
                  name="age"
                  type="number"
                  fullWidth
                  required
                  value={formData.age}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Evaluation Date"
                  name="evaluationDate"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.evaluationDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Evaluator Name"
                  name="evaluatorName"
                  fullWidth
                  value={formData.evaluatorName}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* Instructions */}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2, fontStyle: "italic", textAlign: "center" }}
            >
              Please select the option that best describes your child’s typical
              behavior.
            </Typography>

            <Box
              sx={{
                textAlign: "center",
                mb: 3,
                display: "flex",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Box>
                <Typography variant="h6">✅🙂</Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes / Usually
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">❌🙁</Typography>
                <Typography variant="body2" color="text.secondary">
                  No / Rarely
                </Typography>
              </Box>
            </Box>

            {/* Questions */}
            {autismQuestions.map((q, idx) => (
              <Paper
                key={q.key}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: idx % 2 === 0 ? "#fdfefe" : "#f7faff",
                  transition: "background-color 0.2s ease",
                  "&:hover": { backgroundColor: "#eef7ff" },
                }}
              >
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontWeight: 500,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    {idx + 1}. {q.label}
                  </FormLabel>
                  <RadioGroup
                    row
                    name={q.key}
                    value={responses[q.key] ?? ""}
                    onChange={handleResponseChange}
                    sx={{ justifyContent: "center" }}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio required />}
                      label="✅🙂"
                      sx={{ mx: 2 }}
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio required />}
                      label="❌🙁"
                      sx={{ mx: 2 }}
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>
            ))}

            {/* Submit */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  px: 5,
                  py: 1.8,
                  borderRadius: 4,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(90deg, #64B5F6 0%, #90CAF9 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #42A5F5 0%, #64B5F6 100%)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={26} sx={{ color: "white" }} />
                ) : (
                  "Submit Checklist"
                )}
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Footer */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          sx={{ mt: 3 }}
        >
          This tool is for awareness and early guidance only. It is not a
          diagnostic test. For a professional evaluation, consult your
          pediatrician or a licensed developmental specialist.
        </Typography>
      </Container>
    </Box>
  );
};

export default AutismScreeningForm;
