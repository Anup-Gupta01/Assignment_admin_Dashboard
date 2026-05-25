"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { label: "Users", href: "/dashboard/users" },
  { label: "Products", href: "/dashboard/products" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const initFromStorage = useAuthStore((s) => s.initFromStorage);

  useEffect(() => {
    initFromStorage();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!useAuthStore.getState().user) {
        router.replace("/login");
      }
    }, 50);
    return () => clearTimeout(t);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography
            component={Link}
            href="/dashboard"
            variant="h6"
            sx={{ fontWeight: 600, textDecoration: "none", color: "inherit", mr: 4 }}
          >
            Admin Panel
          </Typography>

          {/* Section nav links */}
          <Box sx={{ display: "flex", gap: 0.5, flexGrow: 1 }}>
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  color="inherit"
                  size="small"
                  sx={{
                    opacity: active ? 1 : 0.75,
                    borderBottom: active ? "2px solid white" : "2px solid transparent",
                    borderRadius: 0,
                    px: 1.5,
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          <Typography variant="body2" sx={{ mr: 2 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Button color="inherit" onClick={handleLogout} size="small">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
