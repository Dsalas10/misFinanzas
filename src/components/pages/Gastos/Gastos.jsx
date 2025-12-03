import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import FormGasto from "./FormGastos";
import ReusableTable from "../../Table/ReuseTable";
import useDialogConfirm from "../../Hooks/useDialogConfirm";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import { api } from "../../utils/api";
const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "concepto", label: "Concepto" },
  { id: "detalle", label: "Detalle" },
  { id: "monto", label: "Monto Gastado" },
  // { id: "total", label: "Total" },
];

const Gastos = ({ user }) => {
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const {
    dialogOpen,
    dialogType,
    dialogData,
    openAddDialog,
    openDeleteDialog,
    closeDialog,
  } = useDialogConfirm();

  const [formData, setFormData] = useState({
    fecha: getCurrentDate(),
    monto: "",
    tipo: "Otros",
  });

  const [loading, setLoading] = useState(true);
  const [gastos, setGastos] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [totalGenerado, setTotalGenerado] = useState(0);
  const [errorGasto, setErrorGasto] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cargarGastosMesActual = useCallback(async () => {
    if (!user || !user._id) {
      setGastos([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api.get(`gastos/${user._id}`);

      setGastos(data.gastos || []);
      setTotalGastado(
        data.gastos.reduce((total, gasto) => total + parseFloat(gasto.monto), 0)
      );
      const dataTotalGenerado = await api.get(
        `resumen/total-generado/${user._id}`
      );
      const {totals} = await api.get(
        `resumen/mes-anterior/${user._id}`
      );
      setTotalGenerado(dataTotalGenerado.totalGenerado + totals.restante);
    } catch (error) {
      console.error("Error al cargar los gastos:", error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    cargarGastosMesActual();
  }, [cargarGastosMesActual]);

  const handleAgregarGasto = async () => {
    const monto = parseFloat(formData.monto) || 0;
    if (totalGastado + monto > totalGenerado) {
      setErrorGasto(
        `No puedes gastar más de lo generado (${totalGenerado.toLocaleString(
          "es-BO"
        )} Bs).`
      );
      closeDialog();
      return;
    }
    setErrorGasto("");
    const nuevoGasto = {
      usuarioId: user._id,
      fecha: formData.fecha || getCurrentDate(),
      monto: monto,
      detalle: formData.detalle || "-",
      concepto: formData.tipo,
    };
    try {
      const response = await api.post("nuevoGasto", nuevoGasto);
      if (response.gasto) {
        await cargarGastosMesActual();
        // setGastos((prevGastos) => [...prevGastos, response.gasto]);
        setFormData({
          fecha: getCurrentDate(),
          monto: "",
          tipo: "Otros",
        });
      } else {
        setError("Error al registrar en la BD el nuevo Gasto");
      }
      closeDialog();
    } catch (error) {
      console.error("Error al agregar el gasto:", error);
    }
  };

  const handleEliminarGasto = async () => {
    if (dialogData) {
      const data = {
        usuarioId: dialogData.usuario,
        gastoId: dialogData._id,
      };
      try {
        await api.delete("gastos/eliminar", data);
        // await cargarGastosMesActual();
        setGastos((prevGastos) =>
          prevGastos.filter((gasto) => gasto._id !== dialogData._id)
        );
        closeDialog();
      } catch (error) {
        console.error("Error al eliminar gasto:", error);
      }
    }
  };

  const handleConfirmAccion = () => {
    if (dialogType === "add") {
      handleAgregarGasto();
    } else if (dialogType === "delete") {
      handleEliminarGasto();
    }
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    // puedes agregar más acciones...
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 1,
              color: "primary.main",
              fontSize: { xs: "1.2rem", sm: "2rem", md: "2.25rem" },
            }}
            textAlign={"center"}
          >
            Registro de Eventos
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 1, sm: 2, md: 2 },
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              color: "white",
              borderRadius: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: { xs: "0.9rem", sm: "1.2rem", md: "1.5rem" },
              }}
            >
              {" "}
              {"Gastado Mes:" + " "}
              {totalGastado.toFixed(0)}
              bs
            </Typography>
          </Paper>
        </Box>
        <Grid container justifyContent={"center"} gap={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <FormGasto
                formData={formData}
                handleInputChange={handleInputChange}
                handleOpenAddDialog={openAddDialog}
                disableAdd={totalGastado >= totalGenerado}
              />
              {errorGasto && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorGasto}
                </Alert>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper>
              <ReusableTable columns={columns} rows={gastos} action={actions} />
            </Paper>
          </Grid>
        </Grid>

        <ConfirmDialog
          open={dialogOpen}
          type={dialogType}
          onCancel={closeDialog}
          onConfirm={handleConfirmAccion}
        />
      </Box>
    </>
  );
};
export default Gastos;
