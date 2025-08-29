import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { id: 1, text: "Dashboard", path: "/" },
    { id: 2, text: "Eventos", path: "/eventos" },
    { id: 3, text: "Préstamos", path: "/prestamos" },
    { id: 4, text: "Gastos", path: "/gastos" },
    { id: 5, text: "Resumen", path: "/resumen" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: "0.90rem", sm: "1.25rem", md: "1.5rem" },
              whiteSpace: "nowrap",
            }}
            noWrap
          >
            GestorFinanzas
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2, md: 3 },
              alignItems: "center",
            }}
          >
            {menuItems.map((item) => (
              <Typography
                key={item.id}
                variant="body1"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  cursor: "pointer",
                  padding: { xs: "6px 8px", sm: "8px 12px", md: "8px 16px" },
                  borderRadius: "4px",
                  backgroundColor:
                    location.pathname === item.path
                      ? "primary.dark"
                      : "transparent",
                  color: "white",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  userSelect: "none",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                  whiteSpace: "nowrap",
                }}
                noWrap
              >
                {item.text}
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
