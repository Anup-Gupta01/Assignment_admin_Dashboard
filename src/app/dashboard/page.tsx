"use client";

import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const sections = [
  {
    label: "Users",
    description: "Browse and search all registered users.",
    href: "/dashboard/users",
    icon: <PeopleOutlinedIcon sx={{ fontSize: 36 }} />,
  },
  {
    label: "Products",
    description: "Explore products, filter by category, and view details.",
    href: "/dashboard/products",
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 36 }} />,
  },
];

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Welcome back. Select a section to get started.
      </Typography>

      <Grid container spacing={2}>
        {sections.map((s) => (
          <Grid key={s.href} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={1}
              component={Link}
              href={s.href}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                textDecoration: "none",
                color: "inherit",
                "&:hover": { bgcolor: "action.hover" },
                transition: "background-color 0.15s",
                cursor: "pointer",
              }}
            >
              <Box sx={{ color: "primary.main" }}>{s.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {s.label}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {s.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
