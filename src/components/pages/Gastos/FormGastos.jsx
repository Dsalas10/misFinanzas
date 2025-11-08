import {
  Button,
  Grid,
  TextField,
  Box,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";

const FormGastos = React.memo(
  ({
    formData,
    handleInputChange,
    handleOpenAddDialog,
    editando,
    handleCancelarEdit,
    openEditDialog,
    disableAdd,
  }) => {
    const tiposGastos = [
      "Alquiler",
      "Internet",
      "Agua y Luz",
      "Fiestas",
      "Comida",
      "Apuestas",
      "Otros",
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
              />
              <InputLabel>Tipo de Gasto</InputLabel>
              <Select
                value={formData.tipo}
                onChange={(e) => handleInputChange("tipo", e.target.value)}
              >
                {tiposGastos.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
              {
                formData.tipo === "Otros" && (
                  <TextField
                    fullWidth
                    label="Detalle Opcional"
                    value={formData.detalle}
                    type="text"
                    onChange={(e) => handleInputChange("detalle", e.target.value)}
                  />
                )}
                
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={formData.monto ||""}
                onChange={(e) => handleInputChange("monto", e.target.value)}
                placeholder="0.00"
                required
              />
            </Box>
          </Grid>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              width="100%"
              onClick={editando ? openEditDialog : handleOpenAddDialog}
              startIcon={editando ? <EditIcon /> : <AddIcon />}
              sx={{ px: 1, py: 1.5 }}
              disabled={disableAdd && !editando}
            >
              {editando ? "Editar Gasto " : "Nuevo Gasto"}
            </Button>
           
            {editando && (
              <Button
                variant="contained"
                color="error"
                sx={{ px: 1, py: 1.5 }}
                onClick={handleCancelarEdit}
                startIcon={<CancelIcon />}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </Grid>
      </>
    );
  }
);
export default FormGastos;
