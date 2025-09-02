import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const ConfirmDialog = ({
  open,
  type, // 'add' o 'delete'
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const getDialogConfig = () => {
    switch (type) {
      case "add":
        return {
          icon: <AddIcon color="success" sx={{ fontSize: 40 }} />,
          confirmColor: "success",
          confirmText: "Sí, Agregar",
          defaultTitle: "Confirmar Agregado",
          defaultMessage: "¿Estás seguro de agregar este registro?",
        };
      case "delete":
        return {
          icon: <DeleteIcon color="error" sx={{ fontSize: 40 }} />,
          confirmColor: "error",
          confirmText: "Sí, Eliminar",
          defaultTitle: "Confirmar Eliminación",
          defaultMessage:
            "¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.",
        };
      default:
        return {
          icon: <WarningIcon color="warning" sx={{ fontSize: 40 }} />,
          confirmColor: "primary",
          confirmText: "Confirmar",
          defaultTitle: "Confirmar Acción",
          defaultMessage: "¿Estás seguro de realizar esta acción?",
        };
    }
  };

  const config = getDialogConfig();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
      disableRestoreFocus
    >
      <Box sx={{ textAlign: "center", py: 3 }}>{config.icon}</Box>

      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="h6" component="div">
          {title || config.defaultTitle}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          {message || config.defaultMessage}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, p: 3 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={config.confirmColor}
          sx={{ minWidth: 120 }}
        >
          {config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
