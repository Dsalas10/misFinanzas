import React, { useCallback, useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useDialogConfirm from "../../Hooks/useDialogConfirm";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import ReusableTable from "../../Table/ReuseTable";
import FormEvento from "./FormEvento";
import { api } from "../../utils/api";

const columns = [
  { id: "id", label: "#" },
  { id: "fecha", label: "Fecha" },
  { id: "tipo", label: "Tipo de Evento" },
  { id: "ventaTotalGeneral", label: "Venta Total" },
  { id: "propina", label: "Propina" },
  { id: "gananciaPorcentaje", label: "Por.%" },
  { id: "gananciaGeneral", label: "Ganancia" },
];
const EventComponent = ({ user }) => {
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const getMontoRestante = () => {
    const montoSistema = parseFloat(formData.montoSistema) || 0;
    const pagoQR = parseFloat(formData.pagoQR) || 0;
    const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;
    const pagoRecibo = parseFloat(formData.pagoRecibo) || 0;
    const incluirRecibo = formData.contarReciboComoPago ? pagoRecibo : 0;
    return Math.max(montoSistema - pagoQR - pagoBaucher - incluirRecibo, 0);
  };

  const [formData, setFormData] = useState({
    fecha: getCurrentDate(),
    montoSistema: "",
    incluirReciboEnVenta: false,
    contarReciboComoPago: false,
    pagafijacheck:false,
    pagaporcentajecheck:false,
    pagoRecibo: "",
    pagoQR: "",
    pagoBaucher: "",
    pagoEfectivo: "0.00",
    propina: "",
    tipo:"Evento",
    porcentaje: "5",
    pagafija:""
    
  });

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    fecha: false,
    montoSistema: false,
  });
  const [editando, setEditando] = useState(false);
  const {
    dialogOpen,
    dialogType,
    dialogData,
    openDeleteDialog,
    openEditDialog,
    openAddDialog,
    closeDialog,
  } = useDialogConfirm();

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
      montoSistema: formData.pagafijacheck ? false :  !formData.montoSistema || parseFloat(formData.montoSistema) <= 0,
      pagafija: formData.pagafijacheck  ? (!formData.pagafija || parseFloat(formData.pagafija) <= 0)  : false,  
      };
    setErrors(newErrors);
    return !newErrors.fecha && !newErrors.montoSistema && !newErrors.pagafija;
  };

  const handleOpenAddDialog = () => {
    if (validateForm()) {
      openAddDialog();
    }
  };

  const cargarEventoMesActual = useCallback(async () => {
    if (!user._id) {
      setLoading(false);
      setVentas([]);
      return;
    }
    try {
      setLoading(true);
      const resp = await api.get(`eventos/${user._id}`);
      setVentas(resp.data || []);
      //   setTotalGenerado(
      //   resp.data.reduce((total, venta) => total + parseFloat(venta.monto), 0)
      // );
    } catch (error) {
      console.error("Error al cargar los Datos de los Eventos:", error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (user._id) {
      cargarEventoMesActual();
    } else {
      setVentas([]);
    }
  }, [cargarEventoMesActual]);

  const handleAgregarEvento = async () => {
    const montoSistema = parseFloat(formData.montoSistema) || 0;
    const pagoQR = parseFloat(formData.pagoQR) || 0;
    const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;
    const propina = parseFloat(formData.propina) || 0;
    const pagoRecibo = parseFloat(formData.pagoRecibo) || 0;
    var ventaTotalGeneral = montoSistema;
    if (formData.incluirReciboEnVenta) {
      ventaTotalGeneral += pagoRecibo;
    }

    // El porcentaje debe ser decimal (ej: 5% = 0.05)
    const porcentajeDecimal = formData.porcentaje
      ? parseFloat(formData.porcentaje) / 100
      : 0.05;
    const gananciaPorcentaje = Math.floor(
      ventaTotalGeneral * porcentajeDecimal
    );
    const gananciaGeneral = parseFloat(gananciaPorcentaje + propina);
    const nuevaVenta = {
      fecha: formData.fecha || getCurrentDate(),
      incluirReciboEnVenta:formData.incluirReciboEnVenta || false,
      contarReciboComoPago:formData.contarReciboComoPago ||false,
      pagafijocheck:formData.pagafijacheck||false,
      pagaporcentaje: formData.pagaporcentajecheck || false,
      pagoRecibo,
      pagoQR,
      pagoBaucher,
      tipo:formData.tipo,
      pagoEfectivo: formData.pagoEfectivo || getMontoRestante(),
      ventaTotalGeneral,
      propina,
      gananciaPorcentaje,
      gananciaGeneral,
      pagafija: parseFloat(formData.pagafija) || 0,
      porcentaje: formData.porcentaje,
      usuario: user._id,
    };
    try {
      const resp = await api.post("eventos/nuevoEvento", nuevaVenta);
      if (!resp.data) {
        console.log(resp.mensaje);
      }
      // setVentas((prev) => [...prev, resp.data]);
      cargarEventoMesActual();
      setFormData({
        fecha: getCurrentDate(),
        montoSistema: "",
        incluirReciboEnVenta: false,
        contarReciboComoPago: false,
        pagafijacheck:false,
        pagaporcentajecheck:false,
        pagafija:"",
        pagoRecibo: "",
        pagoQR: "",
        pagoBaucher: "",
        pagoEfectivo: "0.00",
        propina: "",
        porcentaje: "5",
        tipo:"Evento"
      });

      setErrors({
        fecha: false,
        montoSistema: false,
      });
      setEditando(false); // Al guardar, vuelve a modo "nuevo"
      closeDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEliminarEvento = async () => {
    if (dialogData) {
      const data = { usuarioId: dialogData.usuario, eventoId: dialogData._id };
      try {
        await api.delete("eventos/eliminar", data);
        // setVentas(ventas.filter((venta) => venta._id !== dialogData._id));
        cargarEventoMesActual();

        closeDialog();
      } catch (error) {
        console.log("error en handleEliminarVenta", error);
      }
    }
  };

  const handleEditClick = (row) => {
    setFormData({
      fecha: row.fecha || getCurrentDate(),
      montoSistema: row.ventaTotalGeneral || "",
      incluirReciboEnVenta: row.incluirReciboEnVenta || false,
      contarReciboComoPago: row.contarReciboComoPago || false,
      pagafija:row.pagafija || 0,
      pagafijacheck: row.pagafijacheck || false,
      pagaporcentajecheck: row.pagaporcentajecheck ||false,
      tipo: row.tipo,
      pagafija:row.pagafija || "",
      pagoRecibo: row.pagoRecibo || "",
      pagoQR: row.pagoQR || "",
      pagoBaucher: row.pagoBaucher || "",
      pagoEfectivo: row.pagoEfectivo || "0.00",
      propina: row.propina || "",
      porcentaje: row.porcentaje || "5",
      _id: row._id, // Necesario para identificar qué evento se está editando
      usuario: user._id,
    });
    setEditando(true);
  };

  const handleEditarEvento = async () => {
    // console.log("formdataEdit",formData)
    if (!validateForm()) return;
    const montoSistema = parseFloat(formData.montoSistema) || 0;
    const pagoQR = parseFloat(formData.pagoQR) || 0;
    const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;
    const propina = parseFloat(formData.propina) || 0;
    const pagoRecibo = parseFloat(formData.pagoRecibo) || 0;
    var ventaTotalGeneral = montoSistema;
    if (formData.incluirReciboEnVenta) {
      ventaTotalGeneral += pagoRecibo;
    }
    const porcentajeDecimal = formData.porcentaje
      ? parseFloat(formData.porcentaje) / 100
      : 0.05;
    const gananciaPorcentaje = Math.floor(
      ventaTotalGeneral * porcentajeDecimal
    );
    const gananciaGeneral = parseFloat(gananciaPorcentaje + propina);
    const eventoActualizado = {
      _id: formData._id, // Debes tener el id en formData
      fecha: formData.fecha || getCurrentDate(),
      pagoRecibo,
      pagoQR,
      pagoBaucher,
      pagoEfectivo: formData.pagoEfectivo || getMontoRestante(),
      ventaTotalGeneral,
      propina,
      gananciaPorcentaje,
      gananciaGeneral,
      porcentaje: formData.porcentaje,
      usuarioId: user._id,
      pagafijacheck:formData.pagafijacheck || false,
      pagaporcentajecheck:formData.pagaporcentajecheck || false,
      pagafija:formData.pagafija || 0,
      tipo:formData.tipo,
      incluirReciboEnVenta:formData.incluirReciboEnVenta || false,
      contarReciboComoPago:formData.contarReciboComoPago ||false
    };
    try {
      await api.put(`eventos/actualizar/${formData._id}`, eventoActualizado);
      cargarEventoMesActual();
     setFormData({
        fecha: getCurrentDate(),
        montoSistema: "",
        incluirReciboEnVenta: false,
        contarReciboComoPago: false,
        pagafijacheck:false,
        pagaporcentajecheck:false,
        pagafija:"",
        pagoRecibo: "",
        pagoQR: "",
        pagoBaucher: "",
        pagoEfectivo: "0.00",
        propina: "",
        porcentaje: "5",
        tipo:"Evento"
      });
      setEditando(false);
      setErrors({ fecha: false, montoSistema: false });
      closeDialog();
    } catch (error) {
      console.log("Error al editar el evento", error);
    }
  };

  const handleConfirmAction = () => {
    if (dialogType === "add") {
      handleAgregarEvento();
    } else if (dialogType === "delete") {
      handleEliminarEvento();
    } else if (dialogType === "edit") {
      handleEditarEvento(); // Llama a la función de editar aquí
    }
  };

  const actions = [
    { icon: <DeleteIcon />, tooltip: "Eliminar", onClick: openDeleteDialog },
    { icon: <EditIcon />, tooltip: "Editar", onClick: handleEditClick },
    // puedes agregar más acciones...
  ];

  const formProps = {
    formData,
    handleInputChange,
    errors,
    handleOpenAddDialog,
    openEditDialog,
    montoRestante: getMontoRestante(),
    editando,
    onCancelEdit: () => {
      setEditando(false);
      setFormData({
        fecha: getCurrentDate(),
        montoSistema: "",
        incluirReciboEnVenta: false,
        contarReciboComoPago: false,
        pagafijacheck:false,
        pagaporcentajecheck:false,
        pagafija:"",
        pagoRecibo: "",
        pagoQR: "",
        pagoBaucher: "",
        pagoEfectivo: "0.00",
        propina: "",
        porcentaje: "5",
        tipo:"Evento"
      });
    },
  };

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
          sx={{ mb: 1, color: "primary.main" }}
          textAlign={"center"}
        >
          Registro de Eventos
        </Typography>
        <Grid container spacing={2} justifyContent={"center"}>
          {/* Lado izquierdo - Formulario */}
          <Grid size={{ xs: 12, sm: 5 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, p: 1 }}>
              <FormEvento {...formProps} />
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
        />
      </Box>
    </>
  );
};

export default EventComponent;
