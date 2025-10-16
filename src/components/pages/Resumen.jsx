import React, { useEffect, useState } from "react";
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
import { api } from "../utils/api";

const Resumen = ({ user }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  console.log("user", user);
  // Obtiene el mes actual en formato 'MM'
  const mesActual = String(new Date().getMonth() + 1).padStart(2, "0");
  const [categoria, setCategoria] = useState("eventos");
  const [mes, setMes] = useState(mesActual);
  const [datos, setDatos] = useState([]);
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

  const handleCategoriaChange = (cat) => {
    setCategoria(cat);
  };

  const handleMesChange = (event) => {
    setMes(event.target.value);
  };

  const cargarDatosSelecionados = async () => {
    try {
      let response;
      console.log("CATEGORIA:", categoria, "MES:", mes, "USER:", user?._id);
      if (categoria === "eventos") {
        response = await api.get(`eventos/${user._id}/${mes}`);
        // console.log("response eventos", response.eventos);
        setDatos(response.eventos || []);
        setPage(0);
      } else if (categoria === "gastos") {
        response = await api.get(`gastos/${user._id}/${mes}`);
        setDatos(response.data || []);
        setPage(0);
      } else if (categoria === "prestamos") {
        response = await api.get(`prestamo/${user._id}/${mes}`);
        setDatos(response.data || []);
        setPage(0);
      } else if (categoria === "resumen") {
        // Aquí podrías hacer un endpoint especial para resumen mensual
        setDatos([]);
        setPage(0);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setDatos([]);
    }
  };
  useEffect(() => {
    if (user && user._id) {
      cargarDatosSelecionados();
    } else {
      // Manejar el caso cuando no hay usuario (por ejemplo, limpiar datos)
    }
  }, [categoria, mes, user]);

  return (
  <Box sx={{  width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" >
        Resumen
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          
        }}
      >
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
        <Box sx={{ minWidth: 200 }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              color: "#fff",
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Ganancia total del Mes
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              Bs{" "}
              {datos
                .reduce((acc, item) => acc + (item.gananciaGeneral || 0), 0)
                .toLocaleString("es-BO")}
            </Typography>
          </Paper>
        </Box>
      </Box>
  <TableContainer >
  <Table sx={{ minWidth: 320 }}>
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
            {datos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.id}>
                {categoria === "eventos" && (
                  <>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell>{item.ventaTotalGeneral}</TableCell>
                    <TableCell>{item.gananciaPorcentaje}</TableCell>
                    <TableCell>{item.propina}</TableCell>
                    <TableCell>{item.gananciaGeneral}</TableCell>
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
          {/* Paginación */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
          gap: { xs: 0.5, sm: 2 },
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="contained"
          size="small"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          sx={{ minWidth: 36, px: 1, fontSize: { xs: 12, sm: 14 } }}
        >
          &#8592;
        </Button>
        <Typography
          variant="body2"
          sx={{ mx: { xs: 1, sm: 2 }, fontSize: { xs: 13, sm: 16 }, minWidth: 90, textAlign: 'center' }}
        >
          Página {page + 1} de {Math.max(1, Math.ceil(datos.length / rowsPerPage))}
        </Typography>
        <Button
          variant="contained"
          size="small"
          disabled={page >= Math.ceil(datos.length / rowsPerPage) - 1}
          onClick={() => setPage(page + 1)}
          sx={{ minWidth: 36, px: 1, fontSize: { xs: 12, sm: 14 } }}
        >
          &#8594;
        </Button>
      </Box>
      </TableContainer>
    </Box>
  );
};
export default Resumen;
