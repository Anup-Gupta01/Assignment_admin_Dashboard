import { memo } from "react";
import Link from "next/link";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
  Box,
} from "@mui/material";
import { Product } from "@/store/productsStore";

interface Props {
  product: Product;
}

// Wrapped in memo so the grid doesn't re-render every card when only
// pagination state changes (e.g. page number in parent updates)
const ProductCard = memo(function ProductCard({ product }: Props) {
  return (
    <Card
      elevation={1}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardActionArea
        component={Link}
        href={`/dashboard/products/${product.id}`}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <CardMedia
          component="img"
          image={product.thumbnail}
          alt={product.title}
          sx={{ height: 180, objectFit: "contain", bgcolor: "#fafafa", p: 1 }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.4 }}
          >
            {product.title}
          </Typography>

          <Chip
            label={product.category}
            size="small"
            variant="outlined"
            sx={{ mb: 1, fontSize: "0.7rem" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
            <Rating value={product.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {product.rating.toFixed(1)}
            </Typography>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
            ${product.price.toFixed(2)}
          </Typography>

          {product.discountPercentage > 0 && (
            <Typography variant="caption" sx={{ color: "success.main" }}>
              {product.discountPercentage.toFixed(0)}% off
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export default ProductCard;
