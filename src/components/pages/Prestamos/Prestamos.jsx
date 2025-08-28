import React, { use, useState } from "react";
import { Box, Paper, Typography, TextField, Button, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import useDialog from "../../Hooks/useDialogs";
import ReusableTable from "../../Table/ReuseTable";
import FormPrestamo from "./FormPrestamo";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";

const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "monto", label: "monto" },
  { id: "interes", label: "%" },
  { id: "ganancia", label: "Ganancia" },
  { id: "total", label: "Total" },
];
const Prestamos = () => {
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
    dialogTitle,
    dialogMessage,
    openAddDialog,
    openDeleteDialog,
    closeDialog,
  } = useDialog();

  const [formData, setFormData] = useState({
    fecha: getCurrentDate(),
    monto: "",
    interes: 10,
  });

  const [prestamos, setPrestamos] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAgregarPrestamo = () => {
    const monto = parseFloat(formData.monto) || 0;
    const intereses = (parseFloat(formData.interes) || 10) / 100;
    const gananciaXinteres = monto * intereses;
    const totalMonto = monto + gananciaXinteres;

    const nuevoPrestamo = {
      id: Date.now(),
      fecha: getCurrentDate(),
      monto: monto,
      interes: formData.interes,
      ganancia: gananciaXinteres,
      total: totalMonto,
    };
    console.log("Prestamo guardada:", nuevoPrestamo);
    setPrestamos([...prestamos, nuevoPrestamo]);
    setFormData({
      fecha: getCurrentDate(),
      monto: "",
      interes: 10,
    });

    closeDialog();
  };

  const handleEliminarPrestamo = () => {
    if (dialogData) {
      setPrestamos(
        prestamos.filter((prestamo) => prestamo.id !== dialogData.id)
      );
    }
    closeDialog();
  };

  const handleConfirmAction = () => {
    if (dialogType === "add") {
      handleAgregarPrestamo();
    } else if (dialogType === "delete") {
      handleEliminarPrestamo();
    }
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    // puedes agregar más acciones...
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom textAlign={"center"} sx={{pb:2}}>
        Registro de Préstamos
      </Typography>

      <Grid container spacing={3} justifyContent={"center"}>
        <Grid container sx={{ xs: 12, md: 6 }}>
          <Paper elevation={3} >
            <FormPrestamo
              formData={formData}
              handleInputChange={handleInputChange}
              handleOpenAddDialog={openAddDialog}
            />
          </Paper>
        </Grid>

        <Grid container sx={{ xs: 12, md: 6 }}>
          <Paper elevation={3} >
            <ReusableTable
              columns={columns}
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
