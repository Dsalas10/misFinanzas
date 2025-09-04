import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña");
      return;
    }
    if (username === "admin" && password === "admin") {
      setError("");
      onLogin({ username });
      navigate("/", { replace: true });
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 380,
          width: '100%',
          p: 4,
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography
            variant="h5"
            mb={3}
            textAlign="center"
            fontWeight="bold"
            color="primary"
            letterSpacing={1}
          >
            Iniciar Sesión
          </Typography>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            sx={{ background: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{ background: 'white', borderRadius: 1 }}
          />
          {error && (
            <Typography color="error" variant="body2" mt={1} textAlign="center">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 4, py: 1.4, fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: 1 }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
export default Login;
