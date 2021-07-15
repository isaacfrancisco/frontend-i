import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../services/api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const error = {
    color: 'red',
    fontSize: '12px',
    position: 'relative'
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CreateCollaborator(props) {
    const { open, onClose, handleRefresh } = props;

    const [name, setName] = useState('');
    const [pis, setPis] = useState('');
    const [registration, setRegistration] = useState('');

    const [errorText, setErrorText] = useState('');

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

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

    async function handleCreate(e) {
        e.preventDefault();
        debugger
        if (name === '' || pis === '' || registration === '') {
            setErrorText('Digite os dados corretamente!');
        } else {
            try {
                await api.post("/collaborators", {
                    name,
                    pis,
                    registration,
                });
                setErrorText('');
                handleRefresh();
                onClose();
                handleOpenSnackbar();
            } catch (err) {
                console.log(err)
                setErrorText('');
                handleOpenErrorSnackbar();
            }
        }
    }

    return (
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Criar Colaborador</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Insira os dados para criar um novo colaborador.
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
                    <Button color="primary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleCreate}>
                        Criar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Colaborador criado com sucesso!
                </Alert>
            </Snackbar>
            <Snackbar open={openErrorSnackbar} autoHideDuration={2000} onClose={handleCloseErrorSnackbar}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    Erro ao criar o colaborador!
                </Alert>
            </Snackbar>
        </div>
    );
}