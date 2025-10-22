import React, { useCallback, useState,useEffect } from "react";
import { Typography, Paper, Grid, Box,CircularProgress } from "@mui/material";
import{api} from "../utils/api.js"
const Dashboard = ({user}) => {
  const [totales, setTotales] = useState({
    ganacias: "0.00",
    gastos: "0.00",
    restante: "0.00",
    extras:"0.00"
  });

  const [loading, setLoading] = useState(true);

  const cargarDatosMesActual = useCallback(async () => {
    if (!user._id) {
      setVentas([]); // limpiar la lista si no hay usuario
      return;
    }
    try {
      const respo1 = await api.get(`gastos/${user._id}`);
      const resp2 = await api.get(`eventos/${user._id}`);
      const respo3=await api.get(`ingresoextra/${user._id}`);
      if (respo1.gastos && resp2.data,respo3.ingresosExtras ) {
        let totalGastos = respo1.gastos.reduce(
          (acc, gasto) => acc + parseFloat(gasto.monto),
          0
        )
        let totalVentas = resp2.data.reduce(
          (acc, venta) => acc + parseFloat(venta.gananciaGeneral),
          0
        )
        let totalesIngresoExtra = respo3.ingresosExtras.reduce(
          (acc, ingresoExtra) => acc + parseFloat(ingresoExtra.monto),
          0
        );
        let restante = (totalVentas + totalesIngresoExtra) - totalGastos;
        setTotales({
          ganacias: totalVentas.toLocaleString("es-BO"),
          gastos: totalGastos.toLocaleString("es-BO"),
          extras: totalesIngresoExtra.toLocaleString("es-BO"),
          restante: restante.toLocaleString("es-BO"),
        });
      }
    } catch (error) {
      console.error("Error al cargar los gastos:", error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (user._id) {
      cargarDatosMesActual();
    } else {
      setGastos([]);
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
      <Typography variant="h4" gutterBottom textAlign="center">
        Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent={"center"}>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Ganancias del Trabajo</Typography>
            <Typography variant="h4" color="success.main">
              {totales.ganacias} Bs
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Dinero Extras</Typography>
            <Typography variant="h4" color="success.main">
              {totales.extras} Bs
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Gastos Realizados</Typography>
            <Typography variant="h4" color="error.main">
              {totales.gastos} Bs
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Dinero Sobrante</Typography>
            <Typography variant="h4" color="text.primary">
              {totales.restante} Bs
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Dashboard;
