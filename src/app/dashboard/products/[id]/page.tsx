"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useProductsStore } from "@/store/productsStore";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentProduct, productLoading, productError, fetchProduct } =
    useProductsStore();

  // Track which thumbnail is shown as the main image
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct(Number(id));
    setActiveImage(0); // reset on navigation
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (productLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productError || !currentProduct) {
    return (
      <Box>
        <Button
          component={Link}
          href="/dashboard/products"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Alert severity="error">{productError || "Product not found"}</Alert>
      </Box>
    );
  }

  const p = currentProduct;

  return (
    <Box>
      <Button
        component={Link}
        href="/dashboard/products"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 } }}>
        <Grid container spacing={4}>
          {/* Left: image carousel */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component="img"
              src={p.images[activeImage] ?? p.thumbnail}
              alt={p.title}
              sx={{
                width: "100%",
                maxHeight: 340,
                objectFit: "contain",
                bgcolor: "#fafafa",
                borderRadius: 2,
                p: 2,
              }}
            />
            {/* Thumbnail strip */}
            {p.images.length > 1 && (
              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                {p.images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`${p.title} ${idx + 1}`}
                    onClick={() => setActiveImage(idx)}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "contain",
                      borderRadius: 1,
                      border: "2px solid",
                      borderColor: idx === activeImage ? "primary.main" : "divider",
                      cursor: "pointer",
                      bgcolor: "#fafafa",
                      p: 0.5,
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Right: details */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              label={p.category.replace(/-/g, " ")}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {p.title}
            </Typography>

            {p.brand && (
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                by {p.brand}
              </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating value={p.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {p.rating.toFixed(1)} / 5
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                ${p.price.toFixed(2)}
              </Typography>
              {p.discountPercentage > 0 && (
                <Chip
                  label={`${p.discountPercentage.toFixed(0)}% off`}
                  color="success"
                  size="small"
                />
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", lineHeight: 1.7 }}>
              {p.description}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Specs grid */}
            <Grid container spacing={1.5}>
              <SpecRow label="Stock" value={`${p.stock} units (${p.availabilityStatus})`} />
              <SpecRow label="Weight" value={`${p.weight} kg`} />
              {p.dimensions && (
                <SpecRow
                  label="Dimensions"
                  value={`${p.dimensions.width} × ${p.dimensions.height} × ${p.dimensions.depth} cm`}
                />
              )}
              {p.warrantyInformation && (
                <SpecRow label="Warranty" value={p.warrantyInformation} />
              )}
              {p.shippingInformation && (
                <SpecRow label="Shipping" value={p.shippingInformation} />
              )}
              {p.returnPolicy && (
                <SpecRow label="Returns" value={p.returnPolicy} />
              )}
            </Grid>

            {p.tags?.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {p.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ fontSize: "0.7rem" }} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Grid size={{ xs: 5, sm: 4 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
          {label}
        </Typography>
      </Grid>
      <Grid size={{ xs: 7, sm: 8 }}>
        <Typography variant="caption">{value}</Typography>
      </Grid>
    </>
  );
}
