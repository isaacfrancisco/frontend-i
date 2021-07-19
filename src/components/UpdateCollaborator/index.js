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
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { error, snackbarSuccess, snackbarError } from '../../styles';
import { useSnackbar } from 'notistack';

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
    const [matriculation, setMatriculation] = useState('');

    const [errorText, setErrorText] = useState('');
    const [textErrorPis, setTextErrorPis] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    const [openDialog, setOpenDialog] = useState(false);

    const handleOpen = () => {
        setName(nome);
        setPis(pisColaborador);
        setMatriculation(matricula);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handlePis = (e) => {
        e = e.replace(/\D/g, "");
        if (e.length < 12) {
            setTextErrorPis('É necessário inserir 12 digitos.');
        } else {
            setTextErrorPis('');
        }
        setPis(e);
    }
    const handleRegistration = (e) => {
        e = e.replace(/\D/g, "");
        setMatriculation(e);
    }

    async function handleUpdate(e) {
        e.preventDefault();
        var zero = '';
        for (var i = 1; i <= 16 - matriculation.length; i++) {
            zero += '0';
        }
        var registration = zero + matriculation;

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
                enqueueSnackbar('Colaborador editado com sucesso!', snackbarSuccess);
            } catch (err) {
                console.log(err);
                if (err.response.data.error === "pis already registered") {
                    enqueueSnackbar('Este PIS já foi cadastrado!', snackbarError);
                } else {
                    enqueueSnackbar('Erro ao editar o colaborador!', snackbarError);
                }
                setErrorText('');
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
                        onChange={(e) => handlePis(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <Grid item sm={12}>
                        {textErrorPis && <Typography style={error}>{textErrorPis}</Typography>}
                    </Grid>
                    <TextField
                        margin="dense"
                        id="registration"
                        label="Matrícula"
                        type="text"
                        value={matriculation}
                        onChange={(e) => handleRegistration(e.target.value)}
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
        </span>
    );
}