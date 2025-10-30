import { Container, Grid, Typography, Button, Box, Paper, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFF8E8",
        color: "#2F2F2F",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src="/logo.png" alt="NeuroCheck logo" style={{ width: 80, height: 80, borderRadius: "50%" }}/>
        </Box>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ color: "#5BA7F2", letterSpacing: 1 }}
        >
          Neuro<span style={{ color: "#F59794" }}>Check</span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 2,
            color: "#444",
            fontSize: "1.05rem",
          }}
        >
          Created by <strong>Saanvi Naik</strong>, a 9th-grade student inspired
          by volunteering with children with neurodiverse needs.
        </Typography>
      </Box>

      {/* Main Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography
          variant="h6"
          align="center"
          color="#444"
          sx={{ mb: 5, fontWeight: 500 }}
        >
          A fun, educational app for early screening in Autism, ADHD, and
          Dyslexia.
        </Typography>

        {/* Feature Cards */}
        <Grid container spacing={3} justifyContent="center">
          {/* Card 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 4,
                border: "2px solid #98D8AA",
                borderRadius: 4,
                background: "#fff",
                textAlign: "center",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Typography fontSize="2rem" sx={{ mb: 1 }}>
                💙
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#5BA7F2", mb: 1 }}
              >
                Evidence-Based
              </Typography>
              <Typography variant="body2" color="#444">
                Scientific tools and assessments.
              </Typography>
            </Paper>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 4,
                border: "2px solid #F59794",
                borderRadius: 4,
                background: "#fff",
                textAlign: "center",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Typography fontSize="2rem" sx={{ mb: 1 }}>
                🎮
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#F59794", mb: 1 }}
              >
                Gamified Tests
              </Typography>
              <Typography variant="body2" color="#444">
                Engaging mini-games
              </Typography>
            </Paper>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 4,
                border: "2px solid #C6A7E2",
                borderRadius: 4,
                background: "#fff",
                textAlign: "center",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Typography fontSize="2rem" sx={{ mb: 1 }}>
                📚
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#C6A7E2", mb: 1 }}
              >
                Resource Library
              </Typography>
              <Typography variant="body2" color="#444">
                Comprehensive educational support
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            onClick={() => navigate("/screening-options")}
            sx={{
              background: "linear-gradient(to right, #5BA7F2, #8B5CF6)",
              borderRadius: "9999px",
              px: 5,
              py: 1.6,
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(91,167,242,0.4)",
              "&:hover": {
                background: "linear-gradient(to right, #4D96E0, #7C3AED)",
                boxShadow: "0 6px 16px rgba(91,167,242,0.5)",
              },
            }}
          >
            Start Screening
          </Button>
          <Typography
            variant="caption"
            display="block"
            color="#555"
            sx={{ mt: 2 }}
          >
            This tool is for educational purposes only and does not provide a
            medical diagnosis.
          </Typography>
        </Box>
      </Container>

      {/* Footer Section */}
      <Box>
        <Divider
          sx={{
            height: 4,
            background:
              "linear-gradient(to right, #5BA7F2, #98D8AA, #F6C85F, #C6A7E2)",
          }}
        />
        <Box
          sx={{
            py: 3,
            textAlign: "center",
            background:
              "linear-gradient(to right, #D2F4E4, #C7E7FA)",
          }}
        >
          <Typography variant="body2" color="#2F2F2F">
            Built by <strong>Saanvi Naik</strong>, a 9th-grade developer, for
            the <strong>Congressional App Challenge</strong>. Patent Pending –
            U.S. Provisional Application No.{" "}
            <strong>63/892,247</strong>.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
