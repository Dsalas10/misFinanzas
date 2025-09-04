import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const meses = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const datosEjemplo = {
  eventos: [
    {
      id: 1,
      nombre: "Evento A",
      fecha: "2024-06-10",
      descripcion: "Descripción evento A",
    },
    {
      id: 2,
      nombre: "Evento B",
      fecha: "2024-06-15",
      descripcion: "Descripción evento B",
    },
  ],
  prestamos: [
    { id: 1, nombre: "Préstamo X", fecha: "2024-06-05", monto: 1000 },
    { id: 2, nombre: "Préstamo Y", fecha: "2024-06-20", monto: 2000 },
  ],
  gastos: [
    { id: 1, nombre: "Gasto 1", fecha: "2024-06-02", monto: 150 },
    { id: 2, nombre: "Gasto 2", fecha: "2024-06-18", monto: 300 },
  ],
  resumen: [
    { id: 1, concepto: 5000, monto: 2500, restante: 2500 },
  ],
};
const Resumen = () => {
  const [categoria, setCategoria] = useState("eventos");
  const [mes, setMes] = useState("06");

  const handleCategoriaChange = (cat) => {
    setCategoria(cat);
  };

  const handleMesChange = (event) => {
    setMes(event.target.value);
  };

  const datos = datosEjemplo[categoria] || [];
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Resumen
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <ButtonGroup variant="outlined" color="primary">
          <Button
            variant={categoria === "eventos" ? "contained" : "outlined"}
            onClick={() => handleCategoriaChange("eventos")}
          >
            Eventos
          </Button>
          <Button
            variant={categoria === "prestamos" ? "contained" : "outlined"}
            onClick={() => handleCategoriaChange("prestamos")}
          >
            Préstamos
          </Button>
          <Button
            variant={categoria === "gastos" ? "contained" : "outlined"}
            onClick={() => handleCategoriaChange("gastos")}
          >
            Gastos
          </Button>
          <Button
            variant={categoria === "resumen" ? "contained" : "outlined"}
            onClick={() => handleCategoriaChange("resumen")}
          >
            Resumen
          </Button>
        </ButtonGroup>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="select-mes-label">Mes</InputLabel>
          <Select
            labelId="select-mes-label"
            value={mes}
            label="Mes"
            onChange={handleMesChange}
          >
            {meses.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* Encabezados según categoría */}
              {categoria === "eventos" && (
                <>
                  <TableCell>Fecha</TableCell>
                  <TableCell> Venta(Bs) </TableCell>
                  <TableCell> Gannacia en %(Bs) </TableCell>
                  <TableCell>Propina (Bs)</TableCell>
                  <TableCell>Ganancia (Bs)</TableCell>
                </>
              )}
              {categoria === "prestamos" && (
                <>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Monto Prestado(Bs)</TableCell>
                  <TableCell>Ganancia en %(Bs)</TableCell>
                  <TableCell>Ganancia + Devolucion(BS)</TableCell>
                </>
              )}
              {categoria === "gastos" && (
                <>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo de Gasto</TableCell>
                  <TableCell>Monto(Bs)</TableCell>
                </>
              )}
              {categoria === "resumen" && (
                <>
                  <TableCell>Ganancia Mensual(Bs)</TableCell>
                  <TableCell>Gasto Mensual(Bs)</TableCell>
                  <TableCell>Monto Restante(Bs)</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
            {datos.map((item) => (
              <TableRow key={item.id}>
                {categoria === "eventos" && (
                  <>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                  </>
                )}
                {categoria === "prestamos" && (
                  <>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell>{item.monto}</TableCell>
                  </>
                )}
                {categoria === "gastos" && (
                  <>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell>{item.monto}</TableCell>
                  </>
                )}
                {categoria === "resumen" && (
                  <>
                    <TableCell>{item.concepto}</TableCell>
                    <TableCell>{item.monto}</TableCell>
                    <TableCell>{item.restante}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default Resumen;
