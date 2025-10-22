import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, Paper, Typography, Box, CircularProgress } from "@mui/material";
import FormGasto from "./FormGastos";
import ReusableTable from "../../Table/ReuseTable";
import useDialogConfirm from "../../Hooks/useDialogConfirm";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import { api } from "../../utils/api";

const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "concepto", label: "Tipo de Gasto" },
    {id:"detalle",label:"Detalle"},
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
    openEditDialog,
    closeDialog,
  } = useDialogConfirm();

  const [formData, setFormData] = useState({
    fecha: getCurrentDate(),
    monto: "",
    tipo: "Otros",
    detalle:""
  });

  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const cargarGastosMesActual = useCallback(async () => {
    if (!user._id) {
      setGastos([]); // limpiar la lista si no hay usuario
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Llama a la ruta correcta del backend
      const data = await api.get(`gastos/${user._id}`);
      setGastos(data.gastos || []);
    } catch (error) {
      console.error("Error al cargar los gastos:", error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (user._id) {
    cargarGastosMesActual();
    } else {
      setGastos([]);
    }
  }, [user._id,cargarGastosMesActual]);

  const handleAgregarGasto = useCallback(async () => {
    const monto = parseFloat(formData.monto) || 0;
    const nuevoGasto = {
      usuarioId: user._id,
      fecha: formData.fecha || getCurrentDate(),
      monto: monto,
      concepto: formData.tipo,
      detalle: formData.detalle || "-",
    };
    try {
      const response = await api.post("nuevoGasto", nuevoGasto);

      if (response.gasto) {
        setGastos((prev) => [...prev, response.gasto]);
      }
      setFormData({
        fecha: getCurrentDate(),
        monto: "",
        tipo: "Otros",
        detalle:""
      });
      closeDialog();
    } catch (error) {
      console.error("Error al agregar el gasto:", error);
    }
  }, [formData, user._id, closeDialog]);

  const handleEliminarGasto = useCallback(async () => {
    if (dialogData) {
      const data = {
        usuarioId: dialogData.usuario,
        gastoId: dialogData._id,
      };
      try {
        await api.delete("gastos/eliminar", data);
        setGastos((prevGastos) =>
          prevGastos.filter((gasto) => gasto._id !== dialogData._id)
        );
        closeDialog();
      } catch (error) {
        console.error("Error al eliminar gasto:", error);
      }
    }
  }, [dialogData, closeDialog]);

  const handleClickEdit = useCallback((row) => {
    setFormData({
      id: row._id,
      usuarioId: row.usuario,
      fecha: row.fecha,
      tipo: row.concepto,
      detalle: row.detalle,
      monto: row.monto,
    });
    setEditando(true);
  });

  const handleEditarGasto = useCallback(async () => {
    const monto = parseFloat(formData.monto) || 0;
    const gastoEditado = {
      _id: formData.id,
      usuarioId: formData.usuarioId,
      fecha: formData.fecha,
      concepto: formData.tipo,
      monto: monto,
      detalle: formData.detalle || "-",
    };
    try {
      const response = await api.put(`gastos/editar/${formData.id}`, gastoEditado);
    
      if (response.gasto) {
        cargarGastosMesActual();
      }
      setEditando(false);
      setFormData({
        fecha: getCurrentDate(),
        monto: "",
        tipo: "Otros",
        detalle:""
      });
      closeDialog();
    } catch (error) {
      console.error("Error al editar gasto:", error);
    }
  }, [formData]);

  const handleCancelarEdit = useCallback(() => {
    setFormData({
      fecha: getCurrentDate(),
      monto: "",
      tipo: "Otros",
      detalle:""
    });
    setEditando(false);
  });

  const handleConfirmAccion = useCallback(() => {
    if (dialogType === "add") {
      handleAgregarGasto();
    } else if (dialogType === "delete") {
      handleEliminarGasto();
    } else if (dialogType === "edit") {
      handleEditarGasto();
    }
  }, [dialogType, handleAgregarGasto, handleEliminarGasto, handleEditarGasto]);

  const actions = useMemo(
    () => [
      { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
      { icon: <EditIcon />, tooltip: "Editar", onClick: handleClickEdit },
    ],
    [openDeleteDialog, handleClickEdit]
  );

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
        <Typography
          variant="h4"
          gutterBottom
          textAlign={"center"}
          sx={{ pb: 2 }}
        >
          Registro de Gastos
        </Typography>
        <Grid container justifyContent={"center"} gap={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <FormGasto
                formData={formData}
                handleInputChange={handleInputChange}
                handleOpenAddDialog={openAddDialog}
                editando={editando}
                openEditDialog={openEditDialog}
                handleCancelarEdit={handleCancelarEdit}
              />
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
