import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { submitDyslexiaConsent } from "../services/apiService";

export default function ConsentPage() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    consentGiven: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgree = async () => {
    if (!formData.parentName || !formData.childName) {
      alert("Please fill in both Parent and Child names before proceeding.");
      return;
    }
    if (!agreed) {
      alert("Please check the box to confirm you understand before proceeding.");
      return;
    }

    try {
      setLoading(true);

      const consentData = {
        ...formData,
        consentGiven: true,
      };

      // Call backend API → returns screeningId and saves consent record
      const screeningId = await submitDyslexiaConsent(consentData);

      if (screeningId) {
        localStorage.setItem("screeningId", screeningId); // ✅ store ID for workflow
        localStorage.setItem("childName", formData.childName);
        console.log("Consent saved successfully. Screening ID:", screeningId);
        navigate("/dyslexia"); // move to first screening step
      } else {
        alert("Error: Consent could not be saved. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting consent:", err);
      alert("There was an issue connecting to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F3F4FF 0%, #FAFAFA 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Consent for Dyslexia Screening
          </Typography>

          {/* Disclaimer */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Disclaimer
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              The NeuroCheck Dyslexia Screening is an early awareness tool designed to help
              parents and teachers identify potential reading and language challenges. It is
              not a diagnostic assessment and should not replace professional evaluation by
              a qualified specialist.
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Screening Info */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              About the Screening
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
              This screening includes:
            </Typography>
            <ul style={{ color: "#555", lineHeight: "1.8" }}>
              <li>Scientifically accepted checklist-based questions</li>
              <li>Interactive mini-games that assess reading and focus skills</li>
              <li>A results summary highlighting reading strengths and potential challenges</li>
            </ul>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Privacy */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Privacy and Data Protection
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              All responses and data collected are used solely for educational and awareness
              purposes. Your data will not be shared with any third-party providers or used
              for advertising. Information is securely stored and handled with care.
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Parent and Child Info */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Participant Details
            </Typography>
            <TextField
              label="Parent/Guardian Name"
              name="parentName"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={formData.parentName}
              onChange={handleChange}
            />
            <TextField
              label="Child Name"
              name="childName"
              fullWidth
              required
              value={formData.childName}
              onChange={handleChange}
            />
          </Box>

          {/* Agreement */}
          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body1" color="text.secondary">
                I understand that this screening is for awareness only and does not provide a
                formal diagnosis.
              </Typography>
            }
            sx={{ mb: 4 }}
          />

          {/* Buttons */}
          <Box textAlign="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleAgree}
              disabled={!agreed || loading}
              sx={{
                background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)",
                borderRadius: "9999px",
                textTransform: "none",
                px: 5,
                py: 1.8,
                fontWeight: 600,
                mr: 2,
              }}
            >
              {loading ? "Please wait..." : "I Agree & Start"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleCancel}
              disabled={loading}
              sx={{
                borderColor: "#ccc",
                textTransform: "none",
                px: 5,
                py: 1.8,
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
