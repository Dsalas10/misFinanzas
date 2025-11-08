import React, { useCallback, useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { api } from "../utils/api.js";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";

const Dashboard = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [totales, setTotales] = useState({
    eventos: "0.00",
    gastos: "0.00",
    restante: "0.00",
    extras: "0.00",
    totalDinero: "0.00",
    pendiente: "0.00",
  });

  const [loading, setLoading] = useState(true);
  const [sobranteMesAnterior, setSobranteMesAnterior] = useState("0.00");
  const mesActual = new Date().toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const fechaMesAnterior = new Date();
  fechaMesAnterior.setMonth(fechaMesAnterior.getMonth() - 1);
  const mesAnterior = fechaMesAnterior.toLocaleDateString("es-ES", {
    month: "long",
  });

  const cardsMesActual = [
    {
      title: "Dinero Actual",
      value: totales.restante + sobranteMesAnterior ,
      color: "text.primary",
      icon: <SavingsIcon sx={{ fontSize: 25, color: "white" }} />,
      bg: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)",
    },
    {
      title: "Eventos",
      value: totales.eventos,
      color: "success.main",
      icon: <TrendingUpIcon sx={{ fontSize: 25, color: "white" }} />,
      bg: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
    },
     {
      title: "Paga Pendiente de Eventos ",
      value: totales.pendiente || "0.00",
      color: "text.primary",
      icon: <SavingsIcon sx={{ fontSize: 25, color: "white" }} />,
      bg: "linear-gradient(135deg, #9c27b0 0%, #bac868ff 100%)",
    },
    {
      title: "Extras",
      value: totales.extras,
      color: "success.main",
      icon: <AttachMoneyIcon sx={{ fontSize: 25, color: "white" }} />,
      bg: "linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)",
    },
    {
      title: "Generado",
      value: totales.totalDinero,
      color: "success.main",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 25, color: "white" }} />,
      bg: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
    },
    {
      title: "Gastado",
      value: totales.gastos,
      color: "error.main",
      icon: <MoneyOffIcon sx={{ fontSize: 25, color: "white" }} />,
      bg: "linear-gradient(135deg, #f44336 0%, #ef5350 100%)",
    },
    {
      title: "Sobrante mes" + " " + mesAnterior ,
      value: sobranteMesAnterior || "0.00",
      color: "text.primary",
      icon: <SavingsIcon sx={{ fontSize: 25, color: "white" }} />,
      bg: "linear-gradient(135deg, #607d8b 0%, #222c31ff 100%)",
    },
   
    
  ];

  const cargarDatosMesActual = useCallback(async () => {
    if (!user._id) {
      return;
    }
    try {
      setLoading(true);
      const data = await api.get(`resumen/mes-actual/${user._id}`);
      setTotales({
        eventos: data.totals.eventsTotal.toLocaleString("es-BO"),
        gastos: data.totals.gastosTotal.toLocaleString("es-BO"),
        extras: data.totals.ingresosTotal.toLocaleString("es-BO"),
        restante: data.totals.restante,
        totalDinero: data.totals.totalGenerado.toLocaleString("es-BO"),
        pendiente: data.totals.pendiente,
      
      });
      const dataAnterior = await api.get(`resumen/mes-anterior/${user._id}`);
      setSobranteMesAnterior(dataAnterior.totals.restante);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (user._id) {
      cargarDatosMesActual();
    }
  }, [user._id, cargarDatosMesActual]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Mes Actual */}
      <Typography
        variant="h5"
        sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        {mesActual}
      </Typography>

      <Grid
        container
        spacing={isMobile ? 2 : 2}
        justifyContent="center"
        sx={{ mb: 3 }}
      >
        {cardsMesActual.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              sx={{
                p: isMobile ? 2 : 1,
                textAlign: "center",
                background: card.bg,
                color: "white",
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                minHeight: isMobile ? 100 : 140,
                minWidth: isMobile ? 90 : 120,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {card.icon}
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {card.title}
              </Typography>
              <Typography
                variant={isMobile ? "h6" : "h4"}
                sx={{ fontWeight: "bold" }}
              >
                {card.value} Bs
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

     
    </Box>
  );
};

export default Dashboard;
