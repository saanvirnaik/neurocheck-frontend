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

const ADHDScreeningForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    age: "",
    grade: "",
    evaluatorName: "",
    evaluationDate: "",
  });
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  const adhdQuestions = [
    // Inattention
    { key: "carelessMistakes", label: "Makes careless mistakes or misses small details" },
    { key: "attentionDifficulty", label: "Has trouble focusing on tasks or play" },
    { key: "doesNotListen", label: "Seems not to listen when spoken to directly" },
    { key: "failsToFollowThrough", label: "Starts tasks but struggles to finish them" },
    { key: "difficultyOrganizing", label: "Finds it hard to organize tasks or materials" },
    { key: "avoidsEffortTasks", label: "Avoids tasks that require long concentration" },
    { key: "losesThings", label: "Misplaces items needed for school or activities" },
    { key: "easilyDistracted", label: "Is easily distracted by noises or surroundings" },
    { key: "forgetful", label: "Forgets daily routines or instructions" },

    // Hyperactivity / Impulsivity
    { key: "fidgets", label: "Fidgets or has trouble sitting still" },
    { key: "leavesSeat", label: "Leaves seat when expected to remain seated" },
    { key: "restless", label: "Feels restless or always 'on the go'" },
    { key: "talksExcessively", label: "Talks a lot or interrupts conversations" },
    { key: "blurtsAnswers", label: "Answers questions before they are finished" },
    { key: "difficultyWaitingTurn", label: "Finds it difficult to wait for their turn" },
    { key: "interruptsOthers", label: "Interrupts or intrudes on others during play or conversation" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setResponses((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = { category: "ADHD", ...formData, ...responses };
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
          "linear-gradient(180deg, #FFFDE7 0%, #F9FBE7 60%, #FFFFFF 100%)",
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
          Focus & Attention Awareness Checklist
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          A short, observation-based guide to better understand your child’s
          attention and activity patterns.
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "text.secondary", mb: 4 }}
        >
          Every child’s focus and energy look different. This checklist helps
          parents and teachers notice patterns and support growth—not label
          behavior.
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
            {/* Student Info */}
            <Box
              sx={{
                backgroundColor: "#fdfaf0",
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
                Student Information
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Student Name"
                  name="studentName"
                  fullWidth
                  required
                  value={formData.studentName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Age"
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
                  label="Grade"
                  name="grade"
                  fullWidth
                  value={formData.grade}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Evaluator Name"
                  name="evaluatorName"
                  fullWidth
                  value={formData.evaluatorName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
            </Grid>

            {/* Instructions */}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2, fontStyle: "italic", textAlign: "center" }}
            >
              Please rate each behavior using the faces below:
            </Typography>

            <Box
              sx={{
                textAlign: "center",
                mb: 3,
                display: "flex",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="h6">🙂</Typography>
                <Typography variant="body2" color="text.secondary">
                  Often
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">😐</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sometimes
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">🙁</Typography>
                <Typography variant="body2" color="text.secondary">
                  Occasionally
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">😣</Typography>
                <Typography variant="body2" color="text.secondary">
                  Rarely/Never
                </Typography>
              </Box>
            </Box>

            {/* Questions */}
            {adhdQuestions.map((q, idx) => (
              <Paper
                key={q.key}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: idx % 2 === 0 ? "#fffef9" : "#fffbea",
                  transition: "background-color 0.2s ease",
                  "&:hover": { backgroundColor: "#fff6d6" },
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
                      value={3}
                      control={<Radio required />}
                      label="🙂"
                      sx={{ mx: 2 }}
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio required />}
                      label="😐"
                      sx={{ mx: 2 }}
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio required />}
                      label="🙁"
                      sx={{ mx: 2 }}
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio required />}
                      label="😣"
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
                    "linear-gradient(90deg, #FFD54F 0%, #FFEE58 100%)",
                  color: "#333",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #FFCA28 0%, #FFD740 100%)",
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

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          This tool is for awareness and early guidance only. For a professional
          evaluation, please reach out to your child’s pediatrician or licensed
          specialist.
        </Typography>
      </Container>
    </Box>
  );
};

export default ADHDScreeningForm;
