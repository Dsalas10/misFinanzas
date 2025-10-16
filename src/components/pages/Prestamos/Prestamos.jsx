import React, { useState } from "react";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useDialogConfirm from "../../Hooks/useDialogConfirm";
import ReusableTable from "../../Table/ReuseTable";
import FormPrestamo from "./FormPrestamo";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import { api } from "../../utils/api";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";

const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "monto", label: "monto" },
  { id: "interes", label: "%" },
  { id: "ganancia", label: "Ganancia" },
  { id: "total", label: "Devolucion" },
];
const Prestamos = ({ user }) => {
  const getCurrentDate = useCallback(() => {
    // Memoiza para evitar recreación
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);
  const {
    dialogOpen,
    dialogType,
    dialogData,
    dialogTitle,
    dialogMessage,
    openAddDialog,
    openDeleteDialog,
    closeDialog,
  } = useDialogConfirm();

  const [formData, setFormData] = useState({
    fecha: getCurrentDate(),
    monto: "",
    interes: 10,
  });

  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const cargarPrestamosMesActual = useCallback(async () => {
    if (!user || !user._id) {
      setPrestamos([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const resp = await api.get(`prestamo/${user._id}`);
      setPrestamos(resp.prestamos || []);
    } catch (error) {
      console.error("Error al cargar los Datos de los Prestamos:", error);
      setError("Error al cargar préstamos");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  }, [user._id]);
  useEffect(() => {
    cargarPrestamosMesActual();
  }, [cargarPrestamosMesActual]);

  const handleAgregarPrestamo = useCallback(async () => {
    const monto = parseFloat(formData.monto) || 0;
    if (monto <= 0) {
      setError("Monto inválido");
      return;
    }
    const intereses = (parseFloat(formData.interes) || 10) / 100;
    const gananciaXinteres = monto * intereses;
    const totalMonto = monto + gananciaXinteres;
    const nuevoPrestamo = {
      fecha: formData.fecha || getCurrentDate(),
      monto: monto,
      interes: formData.interes,
      ganancia: gananciaXinteres,
      total: totalMonto,
      usuario: user._id,
    };
    try {
      const respo = await api.post("prestamo/nuevo", nuevoPrestamo);
      console.log("respo",respo)
      if (respo && respo.prestamo) {
        // setPrestamos((prev) => [...prev, respo.prestamo]);
        setPrestamos((prev) =>[...prev,respo.prestamo])
        setFormData({
          fecha: getCurrentDate(),
          monto: "",
          interes: 10,
        });
      } else {
        setError("Error al registrar en la BD");
      }
      closeDialog();
    } catch (error) {
      console.error("Error al agregar el prestamo:", error);
      setError("Error al agregar préstamo");
    }
  }, [user._id, closeDialog, getCurrentDate]);

  const handleEliminarPrestamo = async () => {
    if (dialogData) {
      const data = {
        usuarioId: dialogData.usuario,
        prestamoId: dialogData._id,
      };
      try {
        await api.delete("prestamo/eliminar", data);
        setPrestamos(prestamos.filter((prestamo) => prestamo._id !== dialogData._id));

        closeDialog();
      } catch (error) {
        console.log("error en handleEliminarprestamo", error);
      }
      closeDialog();
    }
  };

  const handleConfirmAction = useCallback(() => {
    if (dialogType === "add") {
      handleAgregarPrestamo();
    } else if (dialogType === "delete") {
      handleEliminarPrestamo();
    }
  }, [dialogType, handleAgregarPrestamo, handleEliminarPrestamo]);

  const actions = useMemo(
    () => [
      { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    ],
    [openDeleteDialog]
  );

  const memoizedColumns = useMemo(() => columns, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom textAlign={"center"} sx={{ pb: 2 }}>
        Registro de Préstamos
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={3} justifyContent={"center"}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormPrestamo
              formData={formData}
              handleInputChange={handleInputChange}
              handleOpenAddDialog={openAddDialog}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3}>
            <ReusableTable
              columns={memoizedColumns}
              rows={prestamos}
              action={actions}
            />
          </Paper>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={dialogOpen}
        type={dialogType}
        onCancel={closeDialog}
        onConfirm={handleConfirmAction}
        title={dialogTitle}
        message={dialogMessage}
      />
    </Box>
  );
};

export default Prestamos;
