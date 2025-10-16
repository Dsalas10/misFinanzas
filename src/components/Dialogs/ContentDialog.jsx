import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, memo } from "react";

const ContentDialog = ({
  open,
  handleClose,
  handleConfirmItems,
  title,
  maxValue,
  initialItems,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState(initialItems || []);
  useEffect(() => {
    if (open) {
      setItems(initialItems || []);
    }
  }, [initialItems, open]);
  
  const total = items.reduce((acc, val) => acc + val, 0);
  const handleAgregarItem = () => {
    const monto = parseFloat(inputValue || 0);
    // Permite agregar si el monto es menor o igual al monto restante
    const montoRestante = maxValue !== undefined ? maxValue - total : undefined;
    if (monto > 0 && (montoRestante === undefined || monto <= montoRestante)) {
      setItems((prev) => [...prev, monto]);
      setInputValue("");
    }
  };

  const handleEliminarItem = (index) => {
    setItems((prev) => {
      const newItems = prev.filter((_, i) => i !== index);
      // Forzar recalculo inmediato del total para la validación
      return newItems;
    });
    setInputValue("");
  };

  const handleConfirmar = () => {
    handleConfirmItems(items);
    document.getElementById("openButton")?.focus();
    setInputValue("");
  };

  const handleCancelar = () => {
    // Si el usuario eliminó todos los items y cierra, borra los confirmados
    if (items.length === 0) {
      handleConfirmItems([]);
    }
    handleClose();
    setInputValue("");
  };

  // Determinar por qué el botón Confirmar está deshabilitado
  const confirmDisabled =
  items.length === 0 || (maxValue !== undefined && total > maxValue);
  let confirmHelper = "";
  if (items.length === 0) {
    confirmHelper = "Agrega al menos un monto para confirmar.";
  } 

  return (
    <>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TableContainer
              component={Paper}
              sx={{ width: "50%", maxHeight: 250, overflowY: "auto" }}
            >
              <Table stickyHeader size="small" aria-label="montos table">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Monto (S/)</TableCell>
                    <TableCell align="center">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          No hay montos agregados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleEliminarItem(index)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Monto"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ej: 10.00"
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAgregarItem();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAgregarItem}
                disabled={
                  inputValue.trim() === "" ||
                  isNaN(parseFloat(inputValue)) ||
                  parseFloat(inputValue) <= 0 ||
                  (maxValue !== undefined && parseFloat(inputValue) > (maxValue - total))
                }
              >
                Agregar monto
              </Button>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total: {total} bs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cantidad Ingresados: {items.length}
                </Typography>
              </Box>
            </Box>
          </Box>
          {confirmDisabled && (
            <Typography color="error" sx={{ mt: 2, mb: 0 }}>
              {confirmHelper}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmar}
            disabled={confirmDisabled}
          >
            Confirmar
          </Button>
          <Button onClick={handleCancelar}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(ContentDialog);
