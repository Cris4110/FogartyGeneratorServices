import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ItemDetailPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!id || !type) return;

    const fetchItem = async () => {
      try {
        const endpoint =
          type === "generator"
            ? `http://localhost:3000/api/generators/${id}`
            : `http://localhost:3000/api/parts/${id}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, type]);

  if (loading) {
    return (
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Typography align="center" mt={10}>
        Item not found
      </Typography>
    );
  }

  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : ["/placeholder.jpg"];

  const inStock = item.Stock > 0;

  return (
    <Box maxWidth="md" mx="auto" mt={6}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
        Back
      </Button>

      {/* Image Viewer */}
      <Box position="relative" mt={3}>
        <img
          src={images[imageIndex]}
          alt=""
          onClick={() => window.open(images[imageIndex], "_blank")}
          style={{
            width: "100%",
            borderRadius: 8,
            cursor: "zoom-in",
          }}
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={() =>
                setImageIndex(
                  (imageIndex - 1 + images.length) % images.length
                )
              }
              sx={{
                position: "absolute",
                top: "50%",
                left: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <IconButton
              onClick={() =>
                setImageIndex((imageIndex + 1) % images.length)
              }
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box display="flex" gap={1} mt={2}>
          {images.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              onClick={() => setImageIndex(i)}
              style={{
                width: 70,
                height: 70,
                borderRadius: 6,
                cursor: "pointer",
                border: imageIndex === i ? "2px solid black" : "none",
              }}
            />
          ))}
        </Box>
      )}

      {/* Item Info */}
      <Typography variant="h5" mt={3}>
        {item.name || item.Part_Name}
      </Typography>
      

      {!inStock && (
        <Typography color="error" mt={1}>
          Currently not available. Call to request restock information.
        </Typography>
      )}

      <Typography mt={2}>
        {item.Description ?? "No description available."}
      </Typography>
      <Typography
          variant="body2"
          color={item.Stock > 0 ? "text.secondary" : "error"}
        >
          {item.Stock > 0 ? `In stock: ${item.Stock}` : "Currently not available"}
        </Typography>
      

      {/* Contact */}
      <Box mt={4}>
        <Typography fontWeight={600}>Contact Owner</Typography>

          Call Owner: 

      </Box>
    </Box>
  );
}
