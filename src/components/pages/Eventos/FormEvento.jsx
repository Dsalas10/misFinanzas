import React from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ReciboList from "./ReciboList";
const FormEvento = ({
  formData,
  handleInputChange,
  pagoEfectivo,
  handleOpenAddDialog,
  errors,
}) => {
  return (
    <>
      {/* 
            lado izquierdo */}
      <Grid container spacing={1}>
        <Grid size={{ xs: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              helperText={errors.fecha ? "La fecha es requerida" : ""}
              required
            />
            <TextField
              fullWidth
              label="Monto Sistema"
              type="number"
              name="montoSistema"
              value={formData.montoSistema}
              onChange={(e) =>
                handleInputChange("montoSistema", e.target.value)
              }
              placeholder="0.00"
              helperText={
                errors.montoSistema ? "El monto del sistema es requerido" : ""
              }
              required
            />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.incluirReciboEnVenta}
                    name="incluirReciboEnVenta"
                    onChange={(e) => {
                      handleInputChange(
                        "incluirReciboEnVenta",
                        e.target.checked
                      );
                      if (e.target.checked) {
                        handleInputChange("contarReciboComoPago", false);
                      }
                    }}
                  />
                }
                label={<span style={{ fontSize: "0.8rem" }}>Sistema</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.contarReciboComoPago}
                    onChange={(e) => {
                      handleInputChange(
                        "contarReciboComoPago",
                        e.target.checked
                      );
                      if (e.target.checked) {
                        handleInputChange("incluirReciboEnVenta", false);
                      }
                    }}
                  />
                }
                label={<span style={{ fontSize: "0.8rem" }}>Pago</span>}
              />
            </Box>
            <ReciboList
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </Box>
        </Grid>
        {/* lado derecho */}
        <Grid size={{ xs: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Pago QR"
              type="number"
              value={formData.pagoQR}
              onChange={(e) => handleInputChange("pagoQR", e.target.value)}
              placeholder="0.00"
            />
            <TextField
              fullWidth
              label="Pago Baucher"
              type="number"
              value={formData.pagoBaucher}
              onChange={(e) => handleInputChange("pagoBaucher", e.target.value)}
              placeholder="0.00"
            />
            <TextField
              fullWidth
              label="Pago Efectivo"
              type="number"
              value={pagoEfectivo}
              placeholder="0.00"
              disabled
            />
            <TextField
              fullWidth
              label="Propina"
              type="number"
              value={formData.propina}
              onChange={(e) => handleInputChange("propina", e.target.value)}
              placeholder="0.00"
            />
          </Box>
        </Grid>
      </Grid>

      <Box textAlign={"center"} m={1}>
        <Button
          variant="contained"
          onClick={handleOpenAddDialog}
          startIcon={<AddIcon />}
          size="large"
          sx={{ px: 4, py: 1.5, pb: 2 }}
        >
          Agregar Venta
        </Button>
      </Box>
    </>
  );
};

export default FormEvento;
