import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { useMemo, useState } from "react";
import { memo } from "react";

const ReusableTable = memo(({ columns, rows, action, loading = false }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const processedColumns = useMemo(() => columns, [columns]);
  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return rows.slice(startIndex, startIndex + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatFecha=(value)=>{
    if(!value) return "-";
    const d=new Date(value)
    return d.toLocaleDateString("es-ES",{
      month:"2-digit",
      day:"2-digit"
        })
  }

  return (
    <Box>
      <TableContainer sx={{ mb: 4, overflowX: "auto" }}>
        <Table
          stickyHeader
          sx={{
            width: "100%",
            tableLayout: "auto",
            fontSize: { xs: 12, sm: 14, md: 16 },
          }}
        >
          <TableHead>
            <TableRow>
              {processedColumns.map((col) => (
                <TableCell key={col.id} align={col.align || "left"}>
                  <b>{col.label}</b>
                </TableCell>
              ))}
              {action?.length > 0 && (
                <TableCell align="center">
                  <b>Acciones</b>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (action.length ? 1 : 0)}
                  align="center"
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : paginatedRows.length > 0 ? (
              paginatedRows.map((row, rowIndex) => (
                <TableRow key={row._id || row.id || rowIndex} hover>
                  {processedColumns.map((col) => {
                    return (
                      <TableCell
                        key={col.id}
                        align={col.align || "left"}
                        sx={{
                          color:
                            col.id === "estadoPago"
                              ? row.estadoPago === "pendiente"
                                ? "#ee1111ff" // Amarillo para pendiente
                                : row.estadoPago === "cancelado"
                                ? "#058f25ff" // Verde para cancelado
                                : "inherit" // Normal para otros
                              : "inherit", // Normal para otras celdas
                          
                        }}
                      >
                        {col.id === "id"
                          ? rows.indexOf(row) + 1
                          : col.id === "fecha"
                          ? formatFecha(row[col.id])
                          : row[col.id] || "-"}
                      </TableCell>
                    );
                  })}
                  {action?.length > 0 && (
                    <TableCell align="center">
                      {action.map((act, i) => (
                        <Tooltip key={i} title={act.tooltip}>
                          <IconButton
                            size="small"
                            onClick={() => act.onClick(row)}
                            sx={{ mr: 0.5 }}
                          >
                            {act.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={processedColumns.length + (action?.length ? 1 : 0)}
                  align="center"
                >
                  No hay Registros
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      )}
    </Box>
  );
});

export default ReusableTable;
