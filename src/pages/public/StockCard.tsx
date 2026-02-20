import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface StockCardProps {
  id: string;
  type: "generator" | "part";
  title: string;
  stock: number;
  Image_Url?: string[] | string;
}

export default function StockCard({
  id,
  type,
  title,
  stock,
  Image_Url,
}: StockCardProps) {
  const navigate = useNavigate();


  const previewImage = Array.isArray(Image_Url)
    ? Image_Url[0]
    : Image_Url;

  return (
    <Card
      onClick={() => navigate(`/item/${type}/${id}`)}
      sx={{
        width: 280,
        height: 340,
        cursor: "pointer",
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      {/* Image Section */}
      <Box
        component="img"
        src={previewImage || "/placeholder.jpg"}
        alt={title}
        sx={{
          height: 200,
          width: "100%",
          objectFit: "cover",
        }}
      />

      {/* Info Section */}
      <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
        <Typography fontWeight={600}>{title}</Typography>

        <Typography
          variant="body2"
          color={stock > 0 ? "text.secondary" : "error"}
        >
          {stock > 0 ? `In stock: ${stock}` : "Currently not available"}
        </Typography>
      </CardContent>
    </Card>
  );
}
