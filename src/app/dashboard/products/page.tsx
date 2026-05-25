"use client";

import { useEffect, useCallback, useMemo } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDebouncedCallback } from "use-debounce";
import { useProductsStore } from "@/store/productsStore";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const {
    products,
    total,
    loading,
    error,
    page,
    pageSize,
    searchQuery,
    selectedCategory,
    categories,
    fetchProducts,
    fetchCategories,
    setPage,
    setSearch,
    setCategory,
  } = useProductsStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts(page, pageSize, searchQuery, selectedCategory);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search — 400ms gives enough time between keystrokes
  const debouncedSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
  }, 400);

  // useCallback so this reference stays stable across renders
  const handleCategoryChange = useCallback(
    (e: SelectChangeEvent) => {
      setCategory(e.target.value);
    },
    [setCategory]
  );

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      setPage(value - 1); // MUI Pagination is 1-indexed
    },
    [setPage]
  );

  // Total pages — only recalculates when total or pageSize changes
  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
        Products
      </Typography>

      {/* Filters row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search products…"
          defaultValue={searchQuery}
          onChange={(e) => debouncedSearch(e.target.value)}
          size="small"
          sx={{ width: { xs: "100%", sm: 280 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.replace(/-/g, " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography sx={{ color: "text.secondary", py: 4 }}>
          No products found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
