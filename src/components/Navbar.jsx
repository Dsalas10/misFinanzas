import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { id:1,text: "Dashboard", path: "/" },
    { id:2,text: "Eventos", path: "/eventos" },
    { id:3,text: "Préstamos", path: "/prestamos" },
    { id:4,text: "Gastos", path: "/gastos" },
    { id:5,text: "Resumen", path: "/resumen" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              backgroundColor:
                location.path === item.path ? "primary.main" : "transparent",
              color: location.path === item.path ? "white" : "text.primar",
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar  position="static" sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GestorFinanzas
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {menuItems.map((item) => (
              <Typography
                key={item.id}
                variant="body1"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  backgroundColor:
                    location.pathname === item.path
                      ? "primary.dark"
                      : "transparent",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                {item.text}
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
