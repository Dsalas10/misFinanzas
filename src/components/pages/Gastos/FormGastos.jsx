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

const FormGastos = ({ formData, handleInputChange, handleOpenAddDialog }) => {
  const tiposGastos = [
    "Alquiler",
    "Internet",
    "Agua y Luz",
    "Cine",
    "Boliche",
    "Comida",
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
            <TextField
              fullWidth
              label="Monto"
              type="number"
              value={formData.monto}
              onChange={(e) => handleInputChange("monto", e.target.value)}
              placeholder="0.00"
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
          </Box>
        </Grid>
        <Button
          variant="contained"
          onClick={handleOpenAddDialog}
          startIcon={<AddIcon />}
          sx={{ px: 4, py: 1.5, pb: 2 }}
        >
          Agregar
        </Button>
      </Grid>
     
    </>
  );
};

export default FormGastos;
