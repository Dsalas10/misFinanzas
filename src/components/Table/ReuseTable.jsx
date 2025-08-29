import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
  Grid,
} from "@mui/material";

const ReusableTable = ({ columns, rows, action ,loading=false}) => {
  return (
    <>
      <TableContainer sx={{ mb: 4 }}>
        <Table
          stickyHeader
          sx={{
            width: "100%",
            tableLayout: "auto",
            fontSize: { xs: 13, sm: 15 },
            "& td, & th": {
              padding: { xs: "6px 2px", sm: "8px 8px" },
              fontSize: { xs: 13, sm: 15 },
              wordBreak: "break-word",
              whiteSpace: "pre-line",
              maxWidth: { xs: 80, sm: 120 },
              overflowWrap: "break-word",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || "left"}>
                  <b>{col.label}</b>
                </TableCell>
              ))}
              {action.length > 0 && (
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
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || "left"}>
                      { row[col.id]}
                    </TableCell>
                  ))}
                  {action.length > 0 && (
                    <TableCell align="center">
                      {action.map((act, i) => (
                        <Tooltip key={i} title={act.tooltip}>
                          <IconButton
                            size="small"
                            onClick={() => act.onClick(row)}
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
                  colSpan={columns.length + action.length}
                  align="center"
                >
                  {"No hay Registro"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReusableTable;
