import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  LinearProgress,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import EmojiObjectsRoundedIcon from "@mui/icons-material/EmojiObjectsRounded";
import GamesRoundedIcon from "@mui/icons-material/GamesRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { getDyslexiaResults } from "../services/apiService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const pdfRef = useRef(null);

  // Try reading from route state first; otherwise fetch by screeningId
  useEffect(() => {
    const stateResults = location.state?.results;
    if (stateResults) {
      setResults(stateResults);
      setLoading(false);
      return;
    }

    const screeningId = localStorage.getItem("screeningId");
    if (!screeningId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getDyslexiaResults(screeningId);
        setResults(data);
      } catch (e) {
        console.error("Failed to load results:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.state]);

  const checklistScore = results?.checklist?.totalScore ?? 0;
  const checklistRisk = results?.checklist?.riskLevel ?? "—";
  const checklistCompletion = useMemo(() => {
    const totalQs = 15; // matches your checklist length
    const answered =
      results?.checklist?.answeredCount ??
      Object.keys(results?.checklist?.responses || {}).length;
    return Math.round((answered / totalQs) * 100);
  }, [results]);

  const wordMatchCorrect = results?.wordMatch?.correct ?? 0;
  const wordMatchTotal = results?.wordMatch?.total ?? 0;
  const patternCorrect = results?.pattern?.correct ?? 0;
  const patternTotal = results?.pattern?.total ?? 0;

  const childName =
    results?.meta?.childName ||
    results?.checklist?.studentName ||
    localStorage.getItem("childName") ||
    "Student";

  const evaluatorName =
    results?.meta?.evaluatorName || results?.checklist?.evaluatorName || "";

  const submittedAt =
    results?.meta?.submittedAt || new Date().toLocaleString();

  const riskColor = (level) => {
    switch ((level || "").toLowerCase()) {
      case "elevated risk":
        return "error";
      case "moderate risk":
        return "warning";
      case "low risk":
        return "success";
      default:
        return "default";
    }
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    // Make sure fonts/icons render well
    const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Image height to keep aspect ratio
    const imgWidth = pageWidth - 48; // side margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 24;
    pdf.setFontSize(14);
    pdf.text("NeuroCheck – Dyslexia Screening Summary", 24, y);
    y += 12;
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 24, y);
    y += 16;

    // If content exceeds one page, add more pages
    let remainingHeight = imgHeight;
    let position = y;

    pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight, undefined, "FAST");
    remainingHeight -= pageHeight - position;

    while (remainingHeight > 0) {
      pdf.addPage();
      position = 24;
      pdf.addImage(
        imgData,
        "PNG",
        24,
        position - (imgHeight - remainingHeight),
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      remainingHeight -= pageHeight;
    }

    pdf.save(`NeuroCheck_${childName}_Results.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Loading results…
        </Typography>
      </Box>
    );
  }

  if (!results) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Results unavailable
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We couldn’t find a completed screening. Please finish the steps first.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/workflow/dyslexia")}>
          Go to Screening
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F3F4FF 0%, #FAFAFA 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            Screening Results
          </Typography>
          <Tooltip title="Download a printable PDF">
            <Button
              onClick={handleExportPDF}
              startIcon={<DownloadRoundedIcon />}
              variant="contained"
              sx={{
                borderRadius: "9999px",
                textTransform: "none",
                px: 3,
                background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              }}
            >
              Download PDF
            </Button>
          </Tooltip>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {submittedAt && <>Generated on {submittedAt}. </>}
          {evaluatorName && <>Evaluator: {evaluatorName}. </>}
        </Typography>

        {/* PDF content wrapper */}
        <Box ref={pdfRef}>
          {/* Header Card */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              mb: 3,
              background: "#fff",
              borderTop: "4px solid #5E60CE",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {childName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Summary of Dyslexia checklist and two mini-games
                </Typography>
                <Chip
                  label={checklistRisk}
                  color={riskColor(checklistRisk)}
                  icon={
                    checklistRisk?.toLowerCase() === "elevated risk" ? (
                      <ErrorOutlineRoundedIcon />
                    ) : (
                      <CheckCircleRoundedIcon />
                    )
                  }
                  sx={{ mr: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                  <Typography variant="caption" color="text.secondary">
                    Checklist completion
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={isNaN(checklistCompletion) ? 0 : checklistCompletion}
                    sx={{ height: 10, borderRadius: 6, mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {isNaN(checklistCompletion) ? "-" : `${checklistCompletion}%`} answered
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Sections */}
          <Grid container spacing={3}>
            {/* Checklist */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <PsychologyRoundedIcon />
                  <Typography variant="h6" fontWeight={700}>
                    Checklist Overview
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Based on your observations. Scores help guide next steps, not labels.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, borderRadius: 3, background: "#F8FAFF" }} variant="outlined">
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Score
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {checklistScore}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, borderRadius: 3, background: "#F8FAFF" }} variant="outlined">
                      <Typography variant="subtitle2" color="text.secondary">
                        Risk Band
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {checklistRisk}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, borderRadius: 3, background: "#F8FAFF" }} variant="outlined">
                      <Typography variant="subtitle2" color="text.secondary">
                        Answered Items
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {isNaN(checklistCompletion) ? "-" : `${checklistCompletion}%`}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Optional: show raw responses in a compact grid */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Item Responses
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(results?.checklist?.responses || {}).map(([k, v]) => (
                    <Grid item xs={6} md={3} key={k}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 1.5, borderRadius: 2, display: "flex", justifyContent: "space-between" }}
                      >
                        <Typography variant="caption" sx={{ mr: 1 }}>
                          {k}
                        </Typography>
                        <Chip
                          size="small"
                          label={v === 2 ? "Often" : v === 1 ? "Sometimes" : "Never"}
                          color={v === 2 ? "warning" : v === 1 ? "info" : "default"}
                          variant={v === 0 ? "outlined" : "filled"}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Word Match */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <GamesRoundedIcon />
                  <Typography variant="h6" fontWeight={700}>
                    Word Match
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Quick look at word–image association and recall.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, borderRadius: 3, background: "#F8FAFF" }} variant="outlined">
                      <Typography variant="subtitle2" color="text.secondary">
                        Correct
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {wordMatchCorrect}/{wordMatchTotal}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Accuracy
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          wordMatchTotal > 0 ? Math.round((wordMatchCorrect / wordMatchTotal) * 100) : 0
                        }
                        sx={{ height: 10, borderRadius: 6, mt: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {wordMatchTotal > 0
                          ? `${Math.round((wordMatchCorrect / wordMatchTotal) * 100)}%`
                          : "—"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Optional: show each pair result */}
                {Array.isArray(results?.wordMatch?.pairs) && results.wordMatch.pairs.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Attempts
                    </Typography>
                    <Stack spacing={1}>
                      {results.wordMatch.pairs.map((p, idx) => (
                        <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                              {p.word} → {p.selected} {p.correct ? "✓" : "✗"}
                            </Typography>
                            <Chip
                              size="small"
                              label={p.correct ? "Correct" : "Incorrect"}
                              color={p.correct ? "success" : "default"}
                              variant={p.correct ? "filled" : "outlined"}
                            />
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </>
                )}
              </Paper>
            </Grid>

            {/* Pattern Recognition */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <EmojiObjectsRoundedIcon />
                  <Typography variant="h6" fontWeight={700}>
                    Pattern Recognition
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Looks at visual sequencing and detail.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, borderRadius: 3, background: "#F8FAFF" }} variant="outlined">
                      <Typography variant="subtitle2" color="text.secondary">
                        Correct
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {patternCorrect}/{patternTotal}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Accuracy
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          patternTotal > 0 ? Math.round((patternCorrect / patternTotal) * 100) : 0
                        }
                        sx={{ height: 10, borderRadius: 6, mt: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {patternTotal > 0
                          ? `${Math.round((patternCorrect / patternTotal) * 100)}%`
                          : "—"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Optional: per-item breakdown */}
                {Array.isArray(results?.pattern?.items) && results.pattern.items.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Attempts
                    </Typography>
                    <Stack spacing={1}>
                      {results.pattern.items.map((it, idx) => (
                        <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                              Q{idx + 1}: chosen <strong>{it.selected}</strong>{" "}
                              {it.correct ? "✓" : "✗"}
                            </Typography>
                            <Chip
                              size="small"
                              label={it.correct ? "Correct" : "Incorrect"}
                              color={it.correct ? "success" : "default"}
                              variant={it.correct ? "filled" : "outlined"}
                            />
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Footer note */}
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ textAlign: "center", mt: 3 }}
          >
            These results are for awareness and planning only. For any concerns, please consult a
            qualified professional.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
