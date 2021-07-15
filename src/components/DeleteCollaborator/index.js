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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function DeleteCollaborator(props) {
    const { id, handleRefresh } = props;

    const [openDialog, setOpenDialog] = useState(false);

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

    const handleOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleOpenErrorSnackbar = () => {
        setOpenErrorSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleCloseErrorSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorSnackbar(false);
    };

    async function handleDelete(e) {
        e.preventDefault();
        try {
            await api.delete("/collaborators/" + id);
            handleRefresh();
            handleClose();
            handleOpenSnackbar();
        } catch (err) {
            console.log(err);
            handleOpenErrorSnackbar();
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
            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Colaborador removido com sucesso!
                </Alert>
            </Snackbar>
            <Snackbar open={openErrorSnackbar} autoHideDuration={2000} onClose={handleCloseErrorSnackbar}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    Erro ao deletar o colaborador!
                </Alert>
            </Snackbar>
        </span>
    );
}