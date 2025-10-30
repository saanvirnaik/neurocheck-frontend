import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
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
  Box,
  CircularProgress,
} from "@mui/material";
import { saveDyslexiaChecklist } from "../services/apiService";

const DyslexiaScreeningForm = forwardRef(({ onSaveComplete }, ref) => {
  const [formData, setFormData] = useState({
    studentName: "",
    age: "",
    grade: "",
    evaluatorName: "",
    evaluationDate: "",
  });
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Prepopulate child name from consent (stored in localStorage)
  useEffect(() => {
    const storedChildName = localStorage.getItem("childName");
    if (storedChildName) {
      setFormData((prev) => ({ ...prev, studentName: storedChildName }));
    }
  }, []);

  const questions = [
    { key: "delayedSpeech", label: "Delayed speech or late language milestones" },
    { key: "letterConfusion", label: "Letter/symbol confusion or reversals (b/d, p/q)" },
    { key: "difficultyLearningLetters", label: "Difficulty learning letter names or sounds" },
    { key: "troubleWithRhymes", label: "Trouble remembering rhymes or rhyming words" },
    { key: "difficultySegmentingWords", label: "Difficulty segmenting words into sounds" },
    { key: "slowReadingProgress", label: "Slower than peers learning to read" },
    { key: "avoidsReadingAloud", label: "Avoids reading aloud or seems anxious" },
    { key: "guessesWords", label: "Guesses words instead of sounding them out" },
    { key: "spellingErrors", label: "Frequent or inconsistent spelling errors" },
    { key: "slowFluency", label: "Reads slowly or with poor fluency" },
    { key: "writingDifficulty", label: "Difficulty writing or copying from the board" },
    { key: "strugglesWithSecondLanguage", label: "Struggles to learn a second language" },
    { key: "mixesLetterOrder", label: "Mixes letter order or adds/omits letters" },
    { key: "avoidsReadingWritingTasks", label: "Avoids reading/writing heavy tasks" },
    { key: "familyHistory", label: "Family history of dyslexia or reading issues" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setResponses((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  // ✅ Method exposed to parent (for Next button)
  useImperativeHandle(ref, () => ({
    async saveScreeningData() {
      try {
        setLoading(true);
        const screeningId = localStorage.getItem("screeningId");
        if (!screeningId) throw new Error("Screening ID not found — consent may not have been submitted.");

        // Basic form validation
        const requiredFields = ["studentName", "age"];
        for (const field of requiredFields) {
          if (!formData[field]) {
            throw new Error("Please enter all required student details before proceeding.");
          }
        }

        // Ensure all questions have responses
        const unanswered = questions.filter((q) => responses[q.key] === undefined);
        if (unanswered.length > 0) {
          throw new Error("Please answer all questions before proceeding.");
        }

        const dataToSubmit = { ...formData, ...responses, screeningId };
        const result = await saveDyslexiaChecklist(dataToSubmit);

        console.log("✅ Checklist saved successfully:", result);
        if (onSaveComplete) onSaveComplete(result);
        return result;
      } catch (err) {
        console.error("❌ Error saving checklist:", err);
        alert(err.message || "Please complete all required fields before proceeding.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
  }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #E3F2FD 0%, #F8F9FA 60%, #FFFFFF 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 1 }}>
          Early Reading & Dyslexia Awareness Checklist
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 1 }}>
          A gentle, observation-based checklist for parents and teachers.
        </Typography>

        <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mb: 4 }}>
          Take your time — there are no right or wrong answers.
        </Typography>

        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, backgroundColor: "#fff" }}>
          <Box sx={{ backgroundColor: "#f7f9fc", borderRadius: 2, px: 2, py: 1, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
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

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2, fontStyle: "italic", textAlign: "center" }}
          >
            Please rate each behavior:
          </Typography>

          {/* Rating Legend */}
          <Box sx={{ textAlign: "center", mb: 3, display: "flex", justifyContent: "center", gap: 3 }}>
            {[{ icon: "🙂", text: "Often" }, { icon: "😐", text: "Sometimes" }, { icon: "🙁", text: "Never" }].map(
              ({ icon, text }) => (
                <Box key={text}>
                  <Typography variant="h6">{icon}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {text}
                  </Typography>
                </Box>
              )
            )}
          </Box>

          {/* Questions */}
          {questions.map((q, idx) => (
            <Paper
              key={q.key}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: idx % 2 === 0 ? "#fdfdfd" : "#f8faff",
                "&:hover": { backgroundColor: "#eef5ff" },
              }}
            >
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" required sx={{ fontWeight: 500, mb: 1, color: "text.primary", "& .MuiRadio-root.Mui-checked": { color: "#42A5F5" }, }}>
                  {idx + 1}. {q.label}
                </FormLabel>
                <RadioGroup
                  row
                  name={q.key}
                  value={responses[q.key] ?? ""}
                  onChange={handleResponseChange}
                  sx={{ justifyContent: "center", alignItems: "center", gap: 4 }}
                >
                  {[{ icon: "🙂", val: 2, text: "Often" }, { icon: "😐", val: 1, text: "Sometimes" }, { icon: "🙁", val: 0, text: "Never" }].map(
                    ({ icon, val, text }) => (
                      <FormControlLabel
                        key={val}
                        value={val}
                        control={<Radio />}
                        label={
                          <Box textAlign="center">
                            <Typography variant="h6" sx={{ lineHeight: 1 }}>
                              {icon}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {text}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          "&:hover": { backgroundColor: "#f3f8ff", borderRadius: "12px" },
                        }}
                      />
                    )
                  )}
                </RadioGroup>
              </FormControl>
            </Paper>
          ))}

          {loading && (
            <Box textAlign="center" mt={3}>
              <CircularProgress color="primary" />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
});

export default DyslexiaScreeningForm;
