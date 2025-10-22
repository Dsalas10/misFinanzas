import React from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { memo } from "react";
const FormIngresoExtra = memo(
  ({ formData, handleInputChange, handleOpenAddDialog }) => {

     const tipo = [
      "Prestamo",
      "Apuesta",
      "Giros",
      "Otros"
    ];

  
    return (
      <>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange("fecha", e.target.value)}
                required
                autoComplete="off"
              />
              <InputLabel>Concepto</InputLabel>
              <Select
                value={formData.concepto}
                onChange={(e)=>handleInputChange("concepto", e.target.value)}>
                {tipo.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
                </Select>
                {formData.concepto === "Otros" && (
                  <TextField
                    fullWidth
                    label="detalle"
                    value={formData.detalle}
                    onChange={(e) => handleInputChange("detalle", e.target.value)}
                    required
                    autoComplete="off"
                  />
                )}
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={formData.monto}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="0.00"
                required
                autoComplete="off"
              />
              
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={handleOpenAddDialog}
              startIcon={<AddIcon />}
              sx={{ px: 4, py: 1.5, pb: 2 }}
            >
              Agregar Ingreso
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default FormIngresoExtra;
