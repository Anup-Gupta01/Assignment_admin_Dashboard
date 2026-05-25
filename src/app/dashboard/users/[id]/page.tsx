"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserDetail } from "@/store/usersStore";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`https://dummyjson.com/users/${id}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box>
        <Button
          component={Link}
          href="/dashboard/users"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
        <Alert severity="error">{error || "User not found"}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={Link}
        href="/dashboard/users"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Users
      </Button>

      <Paper elevation={1} sx={{ p: 4 }}>
        {/* Header section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4, flexWrap: "wrap" }}>
          <Avatar
            src={(user as any).image}
            alt={user.firstName}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              @{user.username}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip label={user.role} size="small" color="primary" variant="outlined" />
              <Chip label={user.gender} size="small" variant="outlined" />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="Age" value={String(user.age)} />
            <InfoRow label="Birth Date" value={user.birthDate} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Company" value={user.company?.name} />
            <InfoRow label="Department" value={user.department} />
            <InfoRow
              label="Address"
              value={`${user.address?.address}, ${user.address?.city}, ${user.address?.state}, ${user.address?.country}`}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}
