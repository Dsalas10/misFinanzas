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
import { api } from "../../utils/api";
const columns = [
  { id: "_id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "concepto", label: "Tipo de Gasto" },
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

  const [gastos, setGastos] = useState([]);
  const [seleccionMes, setSeleccionMes] = useState(new Date().getMonth() + 1); // Mes actual
  const [totalGastado, setTotalGastado] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cargarGastosMesActual = async () => {
    if (!user || !user._id) {
      setGastos([]); // limpiar la lista si no hay usuario
      return;
    }
    try {
      // Llama a la ruta correcta del backend
      const data = await api.get(`gastos/${user._id}`);
      setGastos(data.gastos);
      setTotalGastado(
        data.gastos.reduce((total, gasto) => total + parseFloat(gasto.monto), 0)
      );
    } catch (error) {
      console.error("Error al cargar los gastos:", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      cargarGastosMesActual();
    } else {
      setGastos([]); // limpia cuando el usuario cierra sesión
    }
  }, [user]);

  const handleAgregarGasto = async () => {
    const monto = parseFloat(formData.monto) || 0;
    const nuevoGasto = {
      usuarioId: user._id,
      fecha: formData.fecha || getCurrentDate(),
      monto: monto,
      concepto: formData.tipo,
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
      });
      closeDialog();
    } catch (error) {
      console.error("Error al agregar el gasto:", error);
    }
  };

  const handleEliminarGasto = async () => {
    if (dialogData) {

      const data={
        usuarioId:dialogData.usuario,
        gastoId:dialogData._id
      }
      try {
        await api.delete("gastos/eliminar",data)
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
  const handleMesChange = (event) => {
    setSeleccionMes(event.target.value);
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    // puedes agregar más acciones...
  ];

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
        />
      </Box>
    </>
  );
};
export default Gastos;
