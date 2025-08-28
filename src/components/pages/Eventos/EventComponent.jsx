import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useDialog from "../../Hooks/useDialogs";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import ReusableTable from "../../Table/ReuseTable";
import FormEvento from "./FormEvento";
import useCalcularPagoEfectivo from "../../Hooks/useCalcularPagoEfectivo";
const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "ventaTotalGeneral", label: "Venta Total" },
  { id: "propina", label: "Propina" },
  { id: "gananciaPorcentaje", label: "Por.%" },
  { id: "gananciaGeneral", label: "Ganancia" },
];
const EventComponent = () => {
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    fecha: getCurrentDate(),
    montoSistema: "",
    incluirReciboEnVenta: false,
    contarReciboComoPago: false,
    nuevoRecibo: "",
    pagoQR: "",
    pagoBaucher: "",
    pagoEfectivo: "0.00",
    propina: "",
  });

  const [recibos, setRecibos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [errors, setErrors] = useState({
    fecha: false,
    montoSistema: false,
  });
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

  const {pagoEfectivo}=useCalcularPagoEfectivo(formData,recibos)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {
      fecha: !formData.fecha,
      montoSistema:
        !formData.montoSistema || parseFloat(formData.montoSistema) <= 0,
    };
    setErrors(newErrors);
    return !newErrors.fecha && !newErrors.montoSistema;
  };

 

  const handleOpenAddDialog = () => {
    if (validateForm()) {
      openAddDialog();
    }
  };

  const handleAgregarRecibo = () => {
    const monto = parseFloat(formData.nuevoRecibo);
    if (monto && monto > 0) {
      const nuevoRecibo = {
        id: Date.now(),
        monto: monto,
      };
      setRecibos([...recibos, nuevoRecibo]);
      setFormData((prev) => ({ ...prev, nuevoRecibo: "" }));
    }
  };

  const handleEliminarRecibo = (id) => {
    setRecibos(recibos.filter((recibo) => recibo.id !== id));
  };

  const handleAgregarVenta = () => {
    const montoSistema = parseFloat(formData.montoSistema) || 0;
    const pagoQR = parseFloat(formData.pagoQR) || 0;
    const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;
    const propina = parseFloat(formData.propina) || 0;

    const totalRecibos = recibos.reduce((sum, recibo) => sum + recibo.monto, 0);

    var ventaTotalGeneral = montoSistema;
    if (formData.incluirReciboEnVenta) {
      ventaTotalGeneral += totalRecibos;
    }

    const gananciaPorcentaje = parseFloat(ventaTotalGeneral * 0.05);
    const gananciaGeneral = parseFloat(gananciaPorcentaje + propina);

    const nuevaVenta = {
      id: Date.now(),
      fecha: formData.fecha,
      recibos: [...recibos],
      totalRecibos,
      pagoQR,
      pagoBaucher,
      pagoEfectivo,
      ventaTotalGeneral,
      propina,
      incluirReciboEnVenta: formData.incluirReciboEnVenta,
      contarReciboComoPago: formData.contarReciboComoPago,
      gananciaPorcentaje,
      gananciaGeneral,
    };

    console.log("Venta guardada:", nuevaVenta);
    setVentas([...ventas, nuevaVenta]);

    // Limpiar formulario
    setFormData({
      fecha: getCurrentDate(),
      montoSistema: "",
      incluirReciboEnVenta: false,
      contarReciboComoPago: false,
      nuevoRecibo: "",
      pagoQR: "",
      pagoBaucher: "",
      pagoEfectivo: "0.00",
      propina: "",
    });

    setRecibos([]);
    setErrors({
      fecha: false,
      montoSistema: false,
    });
    closeDialog();
  };

  const handleEliminarVenta = () => {
    if (dialogData) {
      setVentas(ventas.filter((venta) => venta.id !== dialogData.id));
    }
    // console.log("dialogdata",dialogData)
    closeDialog();
  };

  const handleConfirmAction = () => {
    if (dialogType === "add") {
      handleAgregarVenta();
    } else if (dialogType === "delete") {
      handleEliminarVenta();
    }
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    // puedes agregar más acciones...
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 1, color: "primary.main" }}
      >
        Registro de Ventas
      </Typography>
      <Grid container spacing={3} justifyContent={"center"}>
        {/* Lado izquierdo - Formulario */}
        <Grid container sx={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <FormEvento
              formData={formData}
              handleInputChange={handleInputChange}
              handleAgregarRecibo={handleAgregarRecibo}
              recibos={recibos}
              errors={errors}
              handleOpenAddDialog={handleOpenAddDialog}
              pagoEfectivo={pagoEfectivo}
              handleEliminarRecibo={handleEliminarRecibo}
            />
          </Paper>
        </Grid>

        {/* Lado derecho - Tabla de Ventas */}
        <Grid container sx={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>

          <ReusableTable columns={columns} rows={ventas} action={actions} />
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

export default EventComponent;
