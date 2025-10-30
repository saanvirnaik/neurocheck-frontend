import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { savePatternRecognition } from "../services/apiService";

const PatternRecognitionGame = forwardRef((props, ref) => {
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  // Example patterns – you can later randomize or expand
  const patterns = [
    {
      id: 1,
      sequence: ["🔴", "🟢", "🔴", "🟢", "?"],
      options: ["🔴", "🟡", "🟢"],
      correct: "🔴",
    },
    {
      id: 2,
      sequence: ["⬜", "⬛", "⬜", "⬛", "?"],
      options: ["⬜", "⬛", "🟥"],
      correct: "⬜",
    },
    {
      id: 3,
      sequence: ["🔺", "🔵", "🔺", "🔵", "?"],
      options: ["🟢", "🔺", "🔵"],
      correct: "🔺",
    },
  ];

  const [currentPattern, setCurrentPattern] = useState(0);

  const handleSelect = (option) => {
    const pattern = patterns[currentPattern];
    setSelected(option);

    if (option === pattern.correct) {
      setScore((prev) => prev + 1);
    }

    // Move to next pattern after short delay
    setTimeout(() => {
      if (currentPattern < patterns.length - 1) {
        setCurrentPattern((prev) => prev + 1);
        setSelected(null);
      }
    }, 700);
  };

  // ✅ Parent will call this on “Next” in workflow
  useImperativeHandle(ref, () => ({
    async savePatternData() {
      const screeningId = localStorage.getItem("screeningId");
      if (!screeningId) throw new Error("Missing screeningId");

      const data = {
        screeningId,
        score,
        total: patterns.length,
        completedPatterns: currentPattern + 1,
      };

      console.log("Saving pattern data:", data);
      await savePatternRecognition(data);
      return data;
    },
  }));

  const pattern = patterns[currentPattern];

  return (
    <Box textAlign="center">
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Pattern Recognition
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Spot the missing shape to complete the pattern. This activity helps assess
        visual sequencing and perception.
      </Typography>

      {/* Pattern Display */}
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
        {pattern.sequence.map((shape, i) => (
          <Typography
            key={i}
            variant="h4"
            sx={{ mx: 1, opacity: shape === "?" ? 0.5 : 1 }}
          >
            {shape}
          </Typography>
        ))}
      </Box>

      {/* Options */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Choose the missing shape:
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {pattern.options.map((option, i) => (
          <Grid item xs={4} sm={2} key={i}>
            <Paper
              elevation={selected === option ? 6 : 2}
              onClick={() => handleSelect(option)}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                fontSize: "2rem",
                backgroundColor: selected === option ? "#d1fae5" : "#fff",
                "&:hover": { backgroundColor: "#f3f4ff" },
              }}
            >
              {option}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Score Display */}
      <Typography variant="subtitle1" sx={{ mt: 4, color: "text.secondary" }}>
        Score: {score} / {patterns.length}
      </Typography>
    </Box>
  );
});

export default PatternRecognitionGame;
