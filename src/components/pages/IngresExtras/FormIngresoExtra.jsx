import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { memo } from "react";
const FormIngresoExtra = memo(
  ({ formData, handleInputChange, handleOpenAddDialog }) => {
    const tipo = ["Prestamo", "Apuesta", "Giros", "Otros"];

    const [errors, setErrors] = useState({ monto: false });
    const validateForm = () => {
      const newErrors = {
        monto: !formData.monto || parseFloat(formData.monto) <= 0,
      };
      setErrors(newErrors);
      return !newErrors.monto;
    };

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
                onChange={(e) => handleInputChange("concepto", e.target.value)}
              >
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
                value={formData.monto || ""}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="0.00"
                required
                autoComplete="off"
                helperText={errors.monto ? "El monto debe ser mayor a 0" : ""} // Muestra error
                error={errors.monto}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={() => {
                if (validateForm()) {
                  handleOpenAddDialog();
                }
              }}
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
