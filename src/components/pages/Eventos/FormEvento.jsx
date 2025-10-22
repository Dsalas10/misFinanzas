import React from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PagoDialogInput from "./PagoDialogInput";
const FormEvento = ({
  formData,
  handleInputChange,
  handleOpenAddDialog,
  errors,
  montoRestante,
  editando,
  onCancelEdit,
  openEditDialog,
}) => {
  const tipoEventos = ["Evento", "Boliche", "Concierto"];
  function calcularMetodoPago(metodo, contarReciboComoPago) {
    const montoSistma = parseFloat(formData.montoSistema) || 0;
    const pagos = {
      recibo: contarReciboComoPago ? parseFloat(formData.pagoRecibo) : 0,
      qr: parseFloat(formData.pagoQR) || 0,
      baucher: parseFloat(formData.pagoBaucher) || 0,
    };
    let suma = 0;
    Object.keys(pagos).forEach((key) => {
      if (key !== metodo) {
        suma += pagos[key];
      }
    });
    return Math.max(montoSistma - suma, 0);
  }
  return (
    <>
      <Grid container spacing={1}>
        <Box
          sx={{
            border: "1px solid #ccc",
            p: 0.5,
            borderRadius: 1,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InputLabel sx={{ fontSize: "1rem" }}>Modo: </InputLabel>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.pagafijacheck}
                  name="pagafija"
                  onChange={(e) => {
                    handleInputChange("pagafijacheck", e.target.checked);
                    if (e.target.checked) {
                      handleInputChange("pagaporcentajecheck", false);
                    }
                  }}
                />
              }
              label={<span style={{ fontSize: "1rem" }}>Fija</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="pagaporcentajecheck"
                  checked={formData.pagaporcentajecheck}
                  onChange={(e) => {
                    handleInputChange("pagaporcentajecheck", e.target.checked);
                    if (e.target.checked) {
                      handleInputChange("pagafijacheck", false);
                    }
                  }}
                />
              }
              label={<span style={{ fontSize: "1rem" }}>Porcentaje</span>}
            />
          </Box>
        </Box>

        {formData.pagafijacheck ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxWidth: 800,
                width: "100%",
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
              <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
                <InputLabel sx={{ fontSize: "0.8rem" }}>
                  Seleccionar Tipo:
                </InputLabel>
                <Select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange("tipo", e.target.value)}
                  displayEmpty
                  fullWidth
                  required
                >
                  {tipoEventos.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <TextField
                fullWidth
                type="text"
                label="Paga Fija"
                value={formData.pagafija}
                placeholder="0.00"
                onChange={(e) => handleInputChange("pagafija", e.target.value)}
                helperText={errors.pagafija ? "Debe ser mayor a 0" : ""}
                error={errors.pagafija}
              />
              <TextField
                fullWidth
                label="Propina"
                type="number"
                value={formData.propina}
                onChange={(e) => handleInputChange("propina", e.target.value)}
                placeholder="0.00"
              />
              <Box textAlign={"center"} mt={2}>
                <Button
                  variant="contained"
                  color={editando ? "warning" : "primary"}
                  onClick={editando ? openEditDialog : handleOpenAddDialog}
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{ px: 3, py: 1 }}
                >
                  {editando ? "Editar Venta" : "Agregar Venta"}
                </Button>
                {editando && (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      sx={{ px: 2, py: 1, mt: 1 }}
                      onClick={onCancelEdit}
                    >
                      Cancelar edición
                    </Button>
                    <Box
                      mt={1}
                      color="warning.main"
                      fontWeight={600}
                      fontSize={14}
                    >
                      Modo edición activo
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        ) : formData.pagaporcentajecheck ? (
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.9,
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

                <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
                  <InputLabel sx={{ fontSize: "0.8rem" }}>
                    Selecionada Tipo:{" "}
                  </InputLabel>
                  <Select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange("tipo", e.target.value)}
                    displayEmpty
                    fullWidth
                    required
                  >
                    {tipoEventos.map((tipo, index) => (
                      <MenuItem key={index} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <>
                  <PagoDialogInput
                    label="Comandas"
                    value={formData.montoSistema}
                    onChange={(val) => handleInputChange("montoSistema", val)}
                    titleDialog="Monto Comandas"
                    helperText={errors.montoSistema ? "Debe ser Mayor a 0" : ""}
                    // error={!!helperText}
                  />
                  <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
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
                                handleInputChange(
                                  "contarReciboComoPago",
                                  false
                                );
                                handleInputChange("pagoRecibo", "0");
                              }
                            }}
                          />
                        }
                        label={
                          <span style={{ fontSize: "0.8rem" }}>Sistema</span>
                        }
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
                                handleInputChange(
                                  "incluirReciboEnVenta",
                                  false
                                );
                                handleInputChange("pagoRecibo", "0");
                              }
                            }}
                          />
                        }
                        label={<span style={{ fontSize: "0.8rem" }}>Pago</span>}
                      />
                    </Box>
                    <PagoDialogInput
                      label="Pago Recibo o Prepago"
                      value={formData.pagoRecibo}
                      onChange={(val) => handleInputChange("pagoRecibo", val)}
                      maxValue={
                        formData.contarReciboComoPago
                          ? calcularMetodoPago("recibo", true)
                          : undefined
                      }
                      titleDialog="Monto Recibo o Prepago"
                      disabled={
                        !(
                          formData.incluirReciboEnVenta ||
                          formData.contarReciboComoPago
                        )
                      }
                    />
                  </Box>
                </>
              </Box>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <PagoDialogInput
                  label="Pago QR"
                  value={formData.pagoQR}
                  onChange={(val) => handleInputChange("pagoQR", val)}
                  maxValue={calcularMetodoPago(
                    "qr",
                    formData.contarReciboComoPago
                  )}
                  titleDialog="Monto QR"
                  disabled={
                    !formData.montoSistema || formData.montoSistema <= 0
                  }
                />
                <PagoDialogInput
                  label="Pago Baucher"
                  value={formData.pagoBaucher}
                  onChange={(val) => handleInputChange("pagoBaucher", val)}
                  maxValue={calcularMetodoPago(
                    "baucher",
                    formData.contarReciboComoPago
                  )}
                  titleDialog="Monto Baucher"
                  disabled={
                    !formData.montoSistema || formData.montoSistema <= 0
                  }
                />

                <TextField
                  fullWidth
                  label="Pago Efectivo"
                  type="number"
                  value={montoRestante}
                  placeholder="0.00"
                  disabled
                />
                <TextField
                  label="Porcentaje"
                  type="number"
                  name="porcentaje"
                  value={formData.porcentaje}
                  onChange={(e) =>
                    handleInputChange("porcentaje", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                    inputProps: { min: 0 },
                  }}
                  autoComplete="off"
                  disabled={formData.pagafijacheck}
                />
                <TextField
                  fullWidth
                  label="Propina"
                  type="number"
                  value={formData.propina}
                  onChange={(e) => handleInputChange("propina", e.target.value)}
                  placeholder="0.00"
                />
                <Box textAlign={"center"} m={1}>
                  <Button
                    variant="contained"
                    color={editando ? "warning" : "primary"}
                    onClick={editando ? openEditDialog : handleOpenAddDialog}
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{ px: 3, py: 1, pb: 1 }}
                  >
                    {editando ? "Editar Venta" : "Agregar Venta"}
                  </Button>
                  {editando && (
                    <>
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        sx={{ px: 2, py: 1, mt: 1 }}
                        onClick={onCancelEdit}
                      >
                        Cancelar edición
                      </Button>
                      <Box
                        mt={1}
                        color="warning.main"
                        fontWeight={600}
                        fontSize={14}
                      >
                        Modo edición activo
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ width: "100%", textAlign: "center" }} mt={4}>
            <Typography variant="h6">
              Selecciona un modo: Fija o Porcentaje
            </Typography>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default FormEvento;
