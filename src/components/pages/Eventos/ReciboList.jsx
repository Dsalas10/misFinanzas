import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

import ContentDialog from "../../Dialogs/ContentDialog";

const ReciboList = ({ formData, handleInputChange }) => {
  const [open, setOpen] = useState(false);

  // Funciones para abrir y cerrar modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleInputChange("pagoRecibo", "0.00");
  };

  const handleTotalRecibo = (total) => {
    handleInputChange("pagoRecibo", total.toFixed(0));
    setOpen(false);
  };
  return (
    <Box>
      <Typography>
        Prepagos o Recibos
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          fullWidth
          type="number"
          value={formData.pagoRecibo}
          disabled
          placeholder="0.00"
        />
        <Button
          variant="contained"
          onClick={handleOpen}
          disabled={
            !formData.contarReciboComoPago && !formData.incluirReciboEnVenta
          }
        >
          Agregar
        </Button>
      </Box>
      <ContentDialog
        open={open}
        handleClose={handleClose}
        onConfirm={handleTotalRecibo}
      />
    </Box>
  );
};

export default ReciboList;
