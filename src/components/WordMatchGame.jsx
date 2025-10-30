import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { saveWordMatch } from "../services/apiService";

const WordMatchGame = forwardRef((props, ref) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchesMade, setMatchesMade] = useState({});
  const [score, setScore] = useState(0);

  const words = ["Cat", "Dog", "Bat", "Sun"];
  const icons = ["🐱", "🐶", "🦇", "☀️"];

  // ✅ Called by parent workflow when Next is clicked
  useImperativeHandle(ref, () => ({
    async saveGameData() {
      const screeningId = localStorage.getItem("screeningId");
      if (!screeningId) throw new Error("Missing screeningId");

      const data = {
        screeningId,
        score,
        total: words.length,
        matches: matchesMade,
      };

      console.log("Saving WordMatch data:", data);
      await saveWordMatch(data);
      return data;
    },
  }));

  const handleWordSelect = (word) => {
    setSelectedWord(word);
  };

  const handleIconSelect = (icon, wordMatch) => {
    setSelectedMatch(icon);
    if (selectedWord && wordMatch === selectedWord) {
      setMatchesMade((prev) => ({ ...prev, [selectedWord]: icon }));
      setScore((prev) => prev + 1);
    }
    setSelectedWord(null);
  };

  return (
    <Box textAlign="center">
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Word Match Game
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Match each word with its correct image. A quick way to observe recognition and recall.
      </Typography>

      {/* Word Tiles */}
      <Typography variant="h6" sx={{ mb: 2 }}>Words</Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        {words.map((word, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper
              elevation={selectedWord === word ? 6 : 2}
              onClick={() => handleWordSelect(word)}
              sx={{
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                backgroundColor: selectedWord === word ? "#e3f2fd" : "#fff",
                "&:hover": { backgroundColor: "#f3f4ff" },
              }}
            >
              <Typography fontWeight={500}>{word}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Emoji Tiles */}
      <Typography variant="h6" sx={{ mb: 2 }}>Images</Typography>
      <Grid container spacing={2} justifyContent="center">
        {icons.map((icon, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper
              elevation={2}
              onClick={() => handleIconSelect(icon, words[i])}
              sx={{
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                fontSize: "2rem",
                backgroundColor: matchesMade[words[i]] === icon ? "#d1fae5" : "#fff",
                "&:hover": { backgroundColor: "#f3f4ff" },
              }}
            >
              {icon}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Score */}
      <Typography variant="subtitle1" sx={{ mt: 4, color: "text.secondary" }}>
        Score: {score} / {words.length}
      </Typography>
    </Box>
  );
});

export default WordMatchGame;
