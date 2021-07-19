import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../services/api';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { snackbarSuccess, snackbarError } from '../../styles';
import { useSnackbar } from 'notistack';

export default function DeleteCollaborator(props) {
    const { id, handleRefresh } = props;

    const [openDialog, setOpenDialog] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const handleOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    async function handleDelete(e) {
        e.preventDefault();
        try {
            await api.delete("/collaborators/" + id);
            handleRefresh();
            handleClose();
            enqueueSnackbar('Colaborador removido com sucesso!', snackbarSuccess);
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Erro ao remover o colaborador!', snackbarError);
        }
    }

    return (
        <span>
            <Tooltip title="Remover Colaborador">
                <IconButton onClick={handleOpen}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Remover Colaborador</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja remover esse colaborador?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleDelete}>
                        Remover
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    );
}