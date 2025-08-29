import { useState } from "react";

const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // 'add' o 'delete'
  const [dialogData, setDialogData] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const openDialog = (type, data = null, title = '', message = '') => {
    setDialogType(type);
    setDialogData(data);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
    setDialogTitle('');
    setDialogMessage('');
  };

  const openAddDialog = (data = null, title = '', message = '') => {
    openDialog('add', data, title, message);
  };

  const openDeleteDialog = (data = null, title = '', message = '') => {
    openDialog('delete', data, title, message);
  };

  return {
    // Estado
    dialogOpen,
    dialogType,
    dialogData,
    dialogTitle,
    dialogMessage,
    
    // Métodos
    openDialog,
    closeDialog,
    openAddDialog,
    openDeleteDialog
  };
};

export default useDialog;
