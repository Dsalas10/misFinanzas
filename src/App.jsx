import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Layout from "./components/Layout";
import Dashboard from "./components/pages/Dashboard";
import EventComponent from "./components/pages/Eventos/EventComponent";
import IngresoExtra from "./components/pages/IngresExtras/IngresoExtra";
import Gastos from "./components/pages/Gastos/Gastos";
import Resumen from "./components/pages/Resumen";
import Login from "./components/pages/Login/Login";
import { Navigate } from "react-router-dom";
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // Inicializa el estado user directamente desde localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Aquí también puedes limpiar tokens si usas
  };

  console.log("user",user)
  // Componente para rutas protegidas
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout user={user} onLogout={handleLogout} />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard user={user} />} />
            <Route path="eventos" element={<EventComponent user={user}  />} />
            <Route path="ingresos-extras" element={<IngresoExtra user={user} />} />
            <Route path="gastos" element={<Gastos user={user} />} />
            <Route path="resumen" element={<Resumen  user={user} />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
