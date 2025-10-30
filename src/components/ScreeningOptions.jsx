// SelectScreening.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  IconButton,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ExtensionRoundedIcon from "@mui/icons-material/ExtensionRounded";

export default function SelectScreening() {
  const navigate = useNavigate();

  const options = [
    {
      key: "dyslexia-consent",
      title: "Dyslexia",
      desc: "Reading and phonological awareness.",
      Icon: MenuBookRoundedIcon,
      bg: "linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)",
      accent: "#1976d2",
    },
    {
      key: "adhd-consent",
      title: "ADHD",
      desc: "Attention, focus, and impulsivity.",
      Icon: BoltRoundedIcon,
      bg: "linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%)",
      accent: "#2e7d32",
    },
    {
      key: "autism-consent",
      title: "Autism",
      desc: "Social communication and behaviors.",
      Icon: ExtensionRoundedIcon,
      bg: "linear-gradient(135deg, #FFF3E0 0%, #E3F2FD 100%)",
      accent: "#ef6c00",
    },
  ];

  const handleSelect = (key) => navigate(`/${key}`);
  const handleBack = () => navigate(-1); // Navigates back to previous page

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% -10%, #e3f2fd 0%, transparent 60%), radial-gradient(1200px 600px at 110% 10%, #f3e5f5 0%, transparent 60%), #fafafa",
        display: "flex",
        alignItems: "center",
        py: { xs: 4, md: 8 },
        position: "relative",
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative" }}>
        {/* Back button */}
        <IconButton
          onClick={handleBack}
          aria-label="Go back"
          sx={{
            position: "absolute",
            top: { xs: -10, md: 0 },
            left: { xs: -8, md: 0 },
            bgcolor: "#fff",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            "&:hover": {
              bgcolor: "#f5f5f5",
            },
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>

        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 4, px: { xs: 1, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.2,
              mb: 1,
            }}
          >
           Start Exploring How Your Child Learns
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 720,
              mx: "auto",
            }}
          >
            Select the area you want to explore. Each option is age-appropriate
            and can be completed by a parent, teacher, or both.
          </Typography>
        </Box>

        {/* Option cards */}
        <Grid container spacing={3} justifyContent="center">
          {options.map(({ key, title, desc, Icon, bg, accent }) => (
            <Grid key={key} item xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  background: bg,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "transform 120ms ease, box-shadow 120ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleSelect(key)}
                  aria-label={`Start ${title} screening`}
                  sx={{
                    p: 2.5,
                    height: "100%",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 1.25,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 72,
                        height: 72,
                        bgcolor: "#fff",
                        border: "2px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Icon sx={{ fontSize: 40, color: accent }} />
                    </Avatar>
                    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {desc}
                      </Typography>
                    </CardContent>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer helper text */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            These screeners are not diagnoses. They help you decide whether to
            seek a full evaluation.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
