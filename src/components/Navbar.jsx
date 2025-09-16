import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ClickAwayListener,
  Paper,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogout, setShowLogout] = useState(false);

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

  const handleToggle = () => {
    setShowLogout((prev) => !prev);
  };
  const handleClose = () => {
    setShowLogout(false);
  };

  const handleLogoutClick = () => {
    handleClose();
    if (onLogout) onLogout();
    navigate("/login");
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
            Icono
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
            <ClickAwayListener onClickAway={handleClose}>
              <Box
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  color: "white",
                  userSelect: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onClick={handleToggle}
              >
                <Typography noWrap>{user.nombre || "Usuario"}</Typography>
                {showLogout && (
                  <Paper
                    elevation={2}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      mt: 0.5,
                      minWidth: 10,
                      bgcolor: "background.paper",
                      color: "text.primary",
                      borderRadius: 1,
                      boxShadow:
                        "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                      zIndex: 10,
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={handleLogoutClick}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        padding: "8px 16px",
                        color: "text.primary",
                      }}
                    >
                      Cerrar sesión
                    </Button>
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
