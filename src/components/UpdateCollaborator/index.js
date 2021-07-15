import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../services/api';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const error = {
    color: 'red',
    fontSize: '12px',
    position: 'relative'
}

export default function UpdateCollaborator(props) {
    const {
        id,
        nome,
        pisColaborador,
        matricula,
        handleRefresh
    } = props;

    const [name, setName] = useState('');
    const [pis, setPis] = useState('');
    const [registration, setRegistration] = useState('');

    const [errorText, setErrorText] = useState('');

    const [openDialog, setOpenDialog] = useState(false);

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

    const handleOpen = () => {
        setName(nome);
        setPis(pisColaborador);
        setRegistration(matricula);
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

    async function handleUpdate(e) {
        e.preventDefault();

        if (name === '' || pis === '' || registration === '') {
            setErrorText('Digite os dados corretamente!');
        } else {
            try {
                await api.put("/collaborators/" + id, {
                    name,
                    pis,
                    registration,
                });
                setErrorText('');
                handleRefresh();
                handleClose();
                handleOpenSnackbar();
            } catch (err) {
                console.log(err);
                setErrorText('');
                handleOpenErrorSnackbar();
            }
        }
    }

    return (
        <span>
            <Tooltip title="Editar Colaborator">
                <IconButton onClick={handleOpen}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editar Colaborador</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Insira os dados para editar o colaborador.
                    </DialogContentText>
                    <span style={error}> {errorText} </span>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Nome"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="pis"
                        label="PIS"
                        type="text"
                        value={pis}
                        onChange={(e) => setPis(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="registration"
                        label="Matrícula"
                        type="text"
                        value={registration}
                        onChange={(e) => setRegistration(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleUpdate}>
                        Editar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Colaborador editado com sucesso!
                </Alert>
            </Snackbar>
            <Snackbar open={openErrorSnackbar} autoHideDuration={2000} onClose={handleCloseErrorSnackbar}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    Erro ao editar o colaborador!
                </Alert>
            </Snackbar>
        </span>
    );
}