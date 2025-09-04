import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FormGasto from "./FormGastos";
import ReusableTable from "../../Table/ReuseTable";
import useDialogConfirm from "../../Hooks/useDialogConfirm";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";

const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "tipo", label: "Tipo de Gasto" },
  { id: "monto", label: "Monto Gastado" },
  // { id: "total", label: "Total" },
];

const Gastos = () => {
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
  } = useDialogConfirm();

  const [formData, setFormData] = useState({
    fecha: getCurrentDate(),
    monto: "",
    tipo: "Otros",
  });

  const [gastos, setGastos] = useState([]);
  const [seleccionMes, setSeleccionMes] = useState(new Date().getMonth() + 1); // Mes actual
  const [totalGastado, setTotalGastado] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAgregarGasto = () => {
    const monto = parseFloat(formData.monto) || 0;
    const nuevoGasto = {
      id: Date.now(),
      fecha: getCurrentDate(),
      monto: monto,
      tipo: formData.tipo,
    };
    console.log("Gasto guardado:", nuevoGasto);
    setGastos([...gastos, nuevoGasto]);
    setFormData({
      fecha: getCurrentDate(),
      monto: "",
      tipo: "Otros",
    });

    closeDialog();
  };

  const handleEliminarGasto = () => {
    if (dialogData) {
      setGastos(gastos.filter((gasto) => gasto.id !== dialogData.id));
    }
    closeDialog();
  };

  const handleConfirmAccion = () => {
    if (dialogType === "add") {
      handleAgregarGasto();
    } else if (dialogType === "delete") {
      handleEliminarGasto();
    }
  };
  const handleMesChange = (event) => {
    setSeleccionMes(event.target.value);
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    // puedes agregar más acciones...
  ];

  //para el mes en que estamos y se reninca cuand terminara
  // useEffect(() => {
  //   const mesActual = new Date().getMonth() + 1;
  //   if (seleccionarMes !== mesActual) {
  //     setGastos([]); // Resetear gastos si el mes ha cambiado
  //     setSeleccionarMes(mesActual); // Actualizar el mes seleccionado al mes actual
  //   }
  // }, [seleccionarMes]);

  useEffect(() => {
    const total = gastos.reduce((acc, gasto) => {
      const gastoMonth = new Date(gasto.fecha).getMonth() + 1;
      return gastoMonth === seleccionMes ? acc + gasto.monto : acc;
    }, 0);
    setTotalGastado(total);
  }, [gastos, seleccionMes]);

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
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper>
              <ReusableTable columns={columns} rows={gastos} action={actions} />
            </Paper>
          </Grid>
          {/* <Grid size={{ xs: 12, md: 2 }}>
            <Paper>
              <InputLabel>Seleccionar Mes</InputLabel>
              <Select value={seleccionMes} onChange={handleMesChange} fullWidth>
                {Array.from({ length: 12 }, (_, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {new Date(0, index).toLocaleString("default", {
                      month: "long",
                    })}
                  </MenuItem>
                ))}
              </Select>
            </Paper>
          </Grid> */}
        </Grid>
        <Typography variant="h6" sx={{ mt: 2, ml: 20 }} textAlign={"center"}>
          Total Gastado en{" "}
          {new Date(0, seleccionMes - 1).toLocaleString("default", {
            month: "long",
          })}
          : {totalGastado.toFixed(0)}/Bs
        </Typography>
        <ConfirmDialog
          open={dialogOpen}
          type={dialogType}
          onCancel={closeDialog}
          onConfirm={handleConfirmAccion}
          title={dialogTitle}
          message={dialogMessage}
        />
      </Box>
    </>
  );
};
export default Gastos;
