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
  // Obtiene el mes actual en formato 'MM'
  const mesActual = String(new Date().getMonth() + 1).padStart(2, "0");
  const [categoria, setCategoria] = useState("eventos");
  const [mes, setMes] = useState(mesActual);
  const [datos, setDatos] = useState([]);
  const [totales, setTotales] = useState([]);
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
    console.log(event.target.value);
  };

  const cargarDatosSelecionados = async () => {
    try {
      console.log("CATEGORIA:", categoria, "MES:", mes, "USER:", user?._id);
      const response = await api.get(
        `resumen/mes-seleccionado/${user._id}/${mes}`
      );
      // console.log("RESPONSE:", response);
      setTotales(response.totals || []);
      if (categoria === "eventos") {
        // console.log("response eventos", response.eventos);
        setDatos(response.data.eventos || []);
        setPage(0);
      } else if (categoria === "gastos") {
        setDatos(response.data.gastos || []);
        setPage(0);
      } else if (categoria === "ingresoExtras") {
        setDatos(response.data.ingresos || []);
        setPage(0);
      } else if (categoria === "resumen") {
        const { totals } = response;
        const resumenArray = [
          {
            fecha: `${meses.find((m) => m.value === mes)?.label || mes}`,
            eventsTotal: totals.eventsTotal || 0,
            ingresosTotal: totals.ingresosTotal || 0,
            totalGenerado:
              (totals.eventsTotal || 0) + (totals.ingresosTotal || 0),
            gastosTotal: totals.gastosTotal || 0,
            restante: totals.restante || 0,
          },
        ];
        setDatos(resumenArray);
        setPage(0);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setDatos([]);
    }
  };
  useEffect(() => {
    cargarDatosSelecionados();
  }, [categoria, mes]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Resumen</Typography>
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
            variant={categoria === "ingresoExtras" ? "contained" : "outlined"}
            onClick={() => handleCategoriaChange("ingresoExtras")}
          >
            Ingresos Extras
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
        {categoria !== "resumen" && (
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
              <Typography variant="subtitle5" sx={{ fontWeight: "bold" }}>
                {categoria === "eventos" || categoria === "ingresoExtras"
                  ? "Ganancia del Mes :" + " "
                  : ""}
                {categoria === "gastos" && "Gasto del Mes :" + " "}
              </Typography>

              <Typography
                variant="h7"
                sx={{ fontWeight: "bold", letterSpacing: 1 }}
              >
                {(categoria === "eventos" &&
                  totales.eventsTotal?.toLocaleString("es-BO")) ||
                  (categoria === "ingresoExtras" &&
                    totales.ingresosTotal?.toLocaleString("es-BO")) ||
                  (categoria === "gastos" &&
                    totales.gastosTotal?.toLocaleString("es-BO"))}
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 320, border: '1px solid #ddd', marginTop: 2 }}>
          <TableHead>
            <TableRow >
              {/* Encabezados según categoría */}
              {categoria === "eventos" && (
                <>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell> Venta(Bs) </TableCell>
                  <TableCell> Paga </TableCell>
                  <TableCell>Propina (Bs)</TableCell>
                  <TableCell>Ganancia (Bs)</TableCell>
                </>
              )}
              {categoria === "ingresoExtras" && (
                <>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Concepto</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Monto (Bs)</TableCell>
                </>
              )}
              {categoria === "gastos" && (
                <>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo de Gasto</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Monto(Bs)</TableCell>
                </>
              )}
              {categoria === "resumen" && (
                <>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Ganacia Eventos{" "}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Ganancia Extras
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Total Generado
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Gastos Realizados
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Restante o Sobrante
                  </TableCell>
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
            {datos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item._id}>
                  {categoria === "eventos" && (
                    <>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.ventaTotalGeneral}</TableCell>
                      <TableCell>{item.paga}</TableCell>
                      <TableCell>{item.propina}</TableCell>
                      <TableCell>{item.gananciaGeneral}</TableCell>
                    </>
                  )}
                  {categoria === "ingresoExtras" && (
                    <>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>{item.concepto}</TableCell>
                      <TableCell>{item.detalle}</TableCell>
                      <TableCell>{item.monto}</TableCell>
                    </>
                  )}
                  {categoria === "gastos" && (
                    <>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>{item.concepto}</TableCell>
                      <TableCell>{item.detalle}</TableCell>
                      <TableCell>{item.monto}</TableCell>
                    </>
                  )}
                  {categoria === "resumen" && (
                    <>
                      <TableCell
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        {item.fecha}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.eventsTotal}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.ingresosTotal}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.totalGenerado}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.gastosTotal}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item.restante}
                      </TableCell>
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
            width: "100%",
            flexWrap: "wrap",
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
            sx={{
              mx: { xs: 1, sm: 2 },
              fontSize: { xs: 13, sm: 16 },
              minWidth: 90,
              textAlign: "center",
            }}
          >
            Página {page + 1} de{" "}
            {Math.max(1, Math.ceil(datos.length / rowsPerPage))}
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
