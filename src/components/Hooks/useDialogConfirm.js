import { useState } from "react";

const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); 
  const [dialogData, setDialogData] = useState(null);


  const openDialog = (type, data = null) => {
    setDialogType(type);
    setDialogData(data);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  
  };

  const openAddDialog = (data = null) => {
    openDialog('add', data);
  };

  const openDeleteDialog = (data = null) => {
    openDialog('delete', data);
  };

  const openEditDialog = (data = null) => {
    openDialog('edit', data);
  }

  return {
    // Estado
    dialogOpen,
    dialogType,
    dialogData,

    
    // Métodos
    openDialog,
    closeDialog,
    openAddDialog,
    openDeleteDialog,
    openEditDialog,
  };
};

export default useDialog;
