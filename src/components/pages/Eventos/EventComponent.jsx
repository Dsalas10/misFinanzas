import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useDialogConfirm from "../../Hooks/useDialogConfirm";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import ReusableTable from "../../Table/ReuseTable";
import FormEvento from "./FormEvento";
// import useCalcularPagoEfectivo from "../../Hooks/useCalcularPagoEfectivo";
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
    pagoRecibo: "",
    pagoQR: "",
    pagoBaucher: "",
    pagoEfectivo: "0.00",
    propina: "",
  });

  // Calcula el monto restante disponible para pagos QR,baucher y recibos si cuenta como pago
  const getMontoRestante = () => {
    const montoSistema = parseFloat(formData.montoSistema) || 0;
    const pagoQR = parseFloat(formData.pagoQR) || 0;
    const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;
    const pagoRecibo = parseFloat(formData.pagoRecibo) || 0;
    const incluirRecibo = formData.contarReciboComoPago ? pagoRecibo : 0;
    return Math.max(montoSistema - pagoQR - pagoBaucher - incluirRecibo, 0);
  };
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
  } = useDialogConfirm();

  // const { pagoEfectivo } = useCalcularPagoEfectivo(formData);
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

  const handleAgregarVenta = () => {
    const montoSistema = parseFloat(formData.montoSistema) || 0;
    const pagoQR = parseFloat(formData.pagoQR) || 0;
    const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;
    const propina = parseFloat(formData.propina) || 0;
    const pagoRecibo = parseFloat(formData.pagoRecibo) || 0;
    var ventaTotalGeneral = montoSistema;
    if (formData.incluirReciboEnVenta) {
      ventaTotalGeneral += pagoRecibo;
    }

    const gananciaPorcentaje = parseFloat(ventaTotalGeneral * 0.05);
    const gananciaGeneral = parseFloat(gananciaPorcentaje + propina);

    const nuevaVenta = {
      id: Date.now(),
      fecha: formData.fecha,
      incluirReciboEnVenta: formData.incluirReciboEnVenta,
      contarReciboComoPago: formData.contarReciboComoPago,
      pagoRecibo,
      pagoQR,
      pagoBaucher,
      pagoEfectivo:parseFloat(formData.pagoEfectivo) || 0,
      ventaTotalGeneral,
      propina,
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
      pagoRecibo: "",
      pagoQR: "",
      pagoBaucher: "",
      pagoEfectivo: "0.00",
      propina: "",
    });

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
    <>
      <Box sx={{ p: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 1, color: "primary.main" }}
          textAlign={"center"}
        >
          Registro de Ventas
        </Typography>
        <Grid container spacing={2} justifyContent={"center"}>
          {/* Lado izquierdo - Formulario */}
          <Grid size={{ xs: 12, sm: 5 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
              <FormEvento
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                handleOpenAddDialog={handleOpenAddDialog}
                montoRestante={getMontoRestante()}
              />
            </Paper>
          </Grid>

          {/* Lado derecho - Tabla de Ventas */}
          <Grid size={{ xs: 12, sm: 7 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
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
    </>
  );
};

export default EventComponent;
