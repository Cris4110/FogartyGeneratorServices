import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function FAQ() {
  // Store raw FAQ content fetched from API
  const [faqText, setFaqText] = useState("Loading...");
  // Loading state while fetching content
  const [loading, setLoading] = useState(true);

  // Fetch FAQ content from API on component mount
  useEffect(() => {
    // Fetch from pagecontent/faq endpoint and parse the content
    fetch(`${API_BASE}/pagecontent/faq`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setFaqText(d.content || ""))
      .catch((err) => {
        console.error("Failed to load FAQ content:", err);
        setFaqText("");
      })
      .finally(() => setLoading(false));
  }, []);

  // Parse FAQ text by splitting questions and answers
  // Questions start with '-', answers are on following lines
  const parseFaqContent = () => {
    // Return empty array if no content
    if (!faqText) return [];

    // Array to store parsed question-answer pairs
    const items: { question: string; answer: string }[] = [];
    // Split content by newlines and process each line
    const lines = faqText.split("\n");
    // Track current question and answer being built
    let currentQuestion = "";
    let currentAnswer = "";

    // Process each line to extract questions and answers
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      // Check if line starts with '-' (indicates a question)
      if (trimmedLine.startsWith("-")) {
        // Save previous question-answer pair if exists
        if (currentQuestion) {
          items.push({ question: currentQuestion, answer: currentAnswer });
          currentAnswer = "";
        }
        // Start new question (remove the '-' prefix)
        currentQuestion = trimmedLine.substring(1).trim();
      } else if (currentQuestion && trimmedLine) {
        // Add non-empty lines to current answer
        currentAnswer += (currentAnswer ? " " : "") + trimmedLine;
      }
    });

    // Don't forget to add the last question-answer pair
    if (currentQuestion) {
      items.push({ question: currentQuestion, answer: currentAnswer });
    }

    return items;
  };

  // Parse FAQ content to get structured question-answer pairs
  const faqItems = parseFaqContent();

  return (
    <>
      <Navbar />
      {/* Container for questions and answsers*/}
      <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
        {/* Styling and sizing for container*/}
        <Grid container spacing={0} alignItems="left">
          <Grid size={{ xs: 12, md: 15 }}>
            {/* Title with sizing and alignment */}
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              align="center"
            >
              Frequently Asked Questions
            </Typography>

            {/* Display FAQ questions and answers, or fallback message if empty */}
            {faqItems.length > 0 ? (
              faqItems.map((item, index) => (
                // Render each question in bold (h5) with answer below in smaller font (h6)
                <div key={index}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {item.question}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {item.answer}
                  </Typography>
                </div>
              ))
            ) : (
              // Show message if no FAQ content is available
              <Typography variant="h6" color="text.secondary">
                No FAQ content available.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default FAQ;
