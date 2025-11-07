import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { id: 1, text: "Dashboard", path: "/" },
    { id: 2, text: "Eventos", path: "/eventos" },
    { id: 3, text: "Ingresos Extras", path: "/ingresos-extras" },
    { id: 4, text: "Gastos", path: "/gastos" },
    { id: 5, text: "Resumen", path: "/resumen" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogoutClick = () => {
    setDrawerOpen(false);
    if (onLogout) onLogout();
    navigate("/login");
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "primary.main"}}>
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

          {isMobile && (
            <IconButton color="inherit" onClick={toggleDrawer} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          {!isMobile && (
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
                    padding: { xs: "6px 8px", sm: "8px 8px", md: "6px 6px" },
                    borderRadius: "14px",
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
          )}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginLeft:2
              }}
            >
              
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogoutClick}
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    borderColor: "white",
                  },
                }}
              >
                Cerrar sesión
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Menú
          </Typography>
          <List>
            <ListItem sx={{ mb: 2 }}>
              <ListItemText primary={`Usuario: ${user.nombre}`} />
            </ListItem>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    location.pathname === item.path
                      ? "primary.light"
                      : "transparent",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={handleLogoutClick}
              sx={{
                borderRadius: 1,
                mb: 1,
                color: "error.main",
                cursor: "pointer",
              }}
            >
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
