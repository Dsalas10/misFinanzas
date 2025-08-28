import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout";
import Dashboard from "./components/pages/Dashboard";
import EventComponent from "./components/pages/Eventos/EventComponent";
import Prestamos from "./components/pages/Prestamos/Prestamos";
import Gastos from "./components/pages/Gastos/Gastos";
import Resumen from "./components/pages/Resumen";
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
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/eventos" element={<EventComponent />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/resumen" element={<Resumen />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
