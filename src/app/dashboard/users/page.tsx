"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  CircularProgress,
  Chip,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useUsersStore } from "@/store/usersStore";
import { useDebouncedCallback } from "use-debounce";

export default function UsersPage() {
  const {
    users,
    total,
    loading,
    error,
    page,
    pageSize,
    searchQuery,
    fetchUsers,
    setPage,
    setSearch,
  } = useUsersStore();

  // Load users on first mount
  useEffect(() => {
    fetchUsers(page, pageSize, searchQuery);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search input so we don't hit the API on every keystroke
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 400);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    useUsersStore.setState({ pageSize: newSize, page: 0 });
    fetchUsers(0, newSize, searchQuery);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
        Users
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by name, email…"
          defaultValue={searchQuery}
          onChange={(e) => debouncedSearch(e.target.value)}
          size="small"
          sx={{ width: { xs: "100%", sm: 320 } }}
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
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: "text.secondary" }}>No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow
                    key={u.id}
                    hover
                    component={Link}
                    href={`/dashboard/users/${u.id}`}
                    sx={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar src={u.image} alt={u.firstName} sx={{ width: 36, height: 36 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {u.firstName} {u.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {u.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {u.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.gender}
                        size="small"
                        color={u.gender === "male" ? "primary" : "secondary"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {u.company?.name ?? "—"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </Box>
  );
}
