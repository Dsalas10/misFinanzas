import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = ({ user, onLogout }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Navbar user={user} onLogout={onLogout} />
        <Container
          component="main"
          maxWidth={false}
          sx={{
            flex: 1,
            mt: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Container>
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            mt: "auto",
            backgroundColor: "grey.100",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 GestorFinanzas - Sistema de control financiero
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default Layout;
