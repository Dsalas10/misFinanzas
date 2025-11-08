import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
const FormPagaFija = ({
  formData,
  handleInputChange,
  errors,
  tipoEventos,
  editando,
  onCancelEdit,
  handleOpenAddDialog,
}) => {
  return (
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
          <InputLabel sx={{ fontSize: "0.8rem" }}>Seleccionar Tipo:</InputLabel>
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
            sx={{ px: 2, py: 1 }}
          >
            {editando ? "Editar Venta" : "Agregar Venta"}
          </Button>
          {editando && (
            <>
              <Button
                variant="contained"
                color="error"
                size="large"
                sx={{ px: 3, py: 1, ml: 2 }}
                onClick={onCancelEdit}
              >
                Cancelar edición
              </Button>
              <Box mt={1} color="warning.main" fontWeight={600} fontSize={14}>
                Modo edición activo
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default FormPagaFija;
