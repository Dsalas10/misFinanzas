import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import ContentDialog from "../../Dialogs/ContentDialog";

const PagoDialogInput = ({
  label,
  value,
  onChange,
  maxValue,
  titleDialog,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  // Solo limpiar si setconfirmedItems esta vacio o los input del value estan vacio
  useEffect(() => {
    if (!open && (!value || isNaN(parseFloat(value)) || parseFloat(value) === 0)) {
      setConfirmedItems([]);
    }
  }, [open, value]);

  // Al confirmar, guardar los nuevos items y actualizar el valor
  const handleConfirmItems = (items) => {
    setConfirmedItems(items);
    const total = items.reduce((acc, val) => acc + val, 0);
    onChange(total.toFixed(0));
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          fullWidth
          type="number"
          label={label}
          value={value}
          disabled
          placeholder="0.00"
        />
        <Button
          variant="contained"
          onClick={handleOpen}
          disabled={disabled}
        >
          Agregar
        </Button>
      </Box>
      <ContentDialog
        open={open}
        handleClose={handleClose}
        handleConfirmItems={handleConfirmItems}
        title={titleDialog}
        maxValue={maxValue}
        initialItems={confirmedItems}
      />
    </Box>
  );
};

export default PagoDialogInput;
