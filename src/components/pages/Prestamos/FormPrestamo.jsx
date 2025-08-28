import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const FormPrestamo = ({ formData, handleInputChange, handleOpenAddDialog }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid sx={{ xs: 12 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Monto a Prestar"
              type="number"
              value={formData.monto}
              onChange={(e) => handleInputChange("monto", e.target.value)}
              placeholder="0.00"
              required
            />
            <TextField
              fullWidth
              label="Interés (%)"
              type="number"
              placeholder="Interes %"
              value={formData.interes}
              onChange={(e) => handleInputChange("interes", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              variant="contained"
              onClick={handleOpenAddDialog}
              startIcon={<AddIcon />}
              size="large"
              sx={{ px: 4, py: 1.5, pb: 2 }}
            >
              Agregar Prestamo
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default FormPrestamo;
