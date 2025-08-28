import React from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const ReciboList = ({
  recibos,
  handleAgregarRecibo,
  formData,
  handleInputChange,
  handleEliminarRecibo,
}) => {
  return (
    <Box>
      {/* <Typography variant="h7">Prepagos</Typography> */}
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          fullWidth
          label="Nuevo Recibo"
          type="number"
          value={formData.nuevoRecibo}
          onChange={(e) => handleInputChange("nuevoRecibo", e.target.value)}
          disabled={
            !formData.contarReciboComoPago && !formData.incluirReciboEnVenta
          }
          placeholder="0.00"
        />
        <Button
          variant="contained"
          onClick={handleAgregarRecibo}
        >
          Agregar
        </Button>
      </Box>
      {recibos.length > 0 && (
        <List
          dense
          sx={{
            maxHeight: 200,
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: 1,
            mb: 2,
          }}
        >
          {recibos.map((recibo) => (
            <ListItem key={recibo.id}>
              <ListItemText primary={`Recibo: S/ ${recibo.monto.toFixed(2)}`} />
              <IconButton
                edge="end"
                color="error"
                onClick={() => {
                  handleEliminarRecibo(recibo.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ReciboList;
