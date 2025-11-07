import React, { useState } from "react";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useDialogConfirm from "../../Hooks/useDialogConfirm";
import ReusableTable from "../../Table/ReuseTable";
import FormIngresoExtra from "./FormIngresoExtra";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import { api } from "../../utils/api";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";

const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "concepto", label: "Concepto" },
  { id: "detalle", label: "Detalle" },
  { id: "monto", label: "Monto" },
];
const IngresoExtra = ({ user }) => {
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
    concepto: "Otros",
  });

  const [ingresoExtra, setIngresoExtra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cargarIngresoExtraMesActual = useCallback(async () => {
    if (!user._id) {
      setIngresoExtra([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const resp = await api.get(`ingresoextra/${user._id}`);
      setIngresoExtra(resp.ingresosExtras || []);
    } catch (error) {
      console.error("Error al cargar los Datos de los Ingresos Extras:", error);
      setError("Error al cargar ingresos extras");
      setIngresoExtra([]);
    } finally {
      setLoading(false);
    }
  }, [user._id]);
  useEffect(() => {
    cargarIngresoExtraMesActual();
  }, [cargarIngresoExtraMesActual]);

  const handleAgregarIngresoExtra = useCallback(async () => {
    const monto = parseFloat(formData.monto) || 0;
    if (monto <= 0) {
      setError("Monto inválido");
      return;
    }
    const nuevoIngresoExtra = {
      fecha: formData.fecha || getCurrentDate(),
      monto: monto,
      concepto: formData.concepto,
      detalle: formData.detalle || "-",
      usuario: user._id,
    };
    try {
      const respo = await api.post("ingresoextra/nuevo", nuevoIngresoExtra);
      if (respo && respo.ingresoExtra) {
        // setPrestamos((prev) => [...prev, respo.prestamo]);
        setIngresoExtra((prev) => [...prev, respo.ingresoExtra]);
        setFormData({
          fecha: getCurrentDate(),
          monto: "",
          concepto: "Otros",
          detalle: "",
        });
      } else {
        setError("Error al registrar en la BD en Ingreso Extra");
      }
      closeDialog();
    } catch (error) {
      console.error("Error al agregar el Ingreso Extra:", error);
      setError("Error al agregar el Ingreso Extra");
    }
  }, [user._id, closeDialog, getCurrentDate]);

  const handleEliminarIngresoExtra = async () => {
    if (dialogData) {
      const data = {
        usuarioId: dialogData.usuario,
        ingresoExtraId: dialogData._id,
      };
      try {
        await api.delete("ingresoextra/eliminar", data);
        setIngresoExtra(
          ingresoExtra.filter((ingreso) => ingreso._id !== dialogData._id)
        );

        closeDialog();
      } catch (error) {
        console.log("error en handleEliminarIngresoExtra", error);
      }
    }
  };

  const handleConfirmAction = useCallback(() => {
    if (dialogType === "add") {
      handleAgregarIngresoExtra();
    } else if (dialogType === "delete") {
      handleEliminarIngresoExtra();
    }
  }, [dialogType, handleAgregarIngresoExtra, handleEliminarIngresoExtra]);

  const actions = useMemo(
    () => [
      { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    ],
    [openDeleteDialog]
  );

  // const memoizedColumns = useMemo(() => columns, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" ,backgroundColor:"#f5f5f5", p:2}}>
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
          Nuevo Registro
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
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
            {"Ingresos Extras:" + " "}
            {ingresoExtra
              .reduce((acc, item) => {
                const valor = item.monto || 0;
                return acc + valor;
              }, 0)
              .toLocaleString("es-BO")}
            bs
          </Typography>
        </Paper>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container justifyContent={"center"} gap={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormIngresoExtra
              formData={formData}
              handleInputChange={handleInputChange}
              handleOpenAddDialog={openAddDialog}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3}>
            <ReusableTable
              columns={columns}
              rows={ingresoExtra}
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

export default IngresoExtra;
