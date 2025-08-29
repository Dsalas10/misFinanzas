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
import { useState } from "react";

const ContentDialog = ({ open, handleClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  const handleAgregarItem = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      setItems((prev) => [...prev, value]);
      setInputValue("");
    }
  };

  const handleEliminarItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleConfirmar=()=>{
    onConfirm(Total)
    setItems([])
  }

  const handleCancelar=()=>{
    handleClose()
    setItems([])
  }
  const Total = items.reduce((acc, val) => acc + val, 0);

  return (
    <>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Modal de prueba</DialogTitle>
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
                disabled={inputValue.trim() === ""}
              >
                Agregar monto
              </Button>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total: {Total} bs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cantidad Ingresados: {items.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmar} disabled={items.length === 0}>
            Confirmar
          </Button>
          <Button onClick={handleCancelar}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContentDialog;
