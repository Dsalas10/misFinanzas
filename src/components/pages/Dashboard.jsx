import React from "react";
import { Typography, Paper, Grid, Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom textAlign="center">
        Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent={"center"}>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Ventas del Mes</Typography>
            <Typography variant="h4" color="primary">
              $0.00
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Ganancias</Typography>
            <Typography variant="h4" color="success.main">
              $0.00
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Gastos</Typography>
            <Typography variant="h4" color="error.main">
              $0.00
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Balance</Typography>
            <Typography variant="h4" color="text.primary">
              $0.00
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Dashboard;
