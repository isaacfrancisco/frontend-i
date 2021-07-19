import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../services/api';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { error, snackbarSuccess, snackbarError } from '../../styles';
import { useSnackbar } from 'notistack';

export default function CreateCollaborator(props) {
    const { open, onClose, handleRefresh } = props;

    const [name, setName] = useState('');
    const [pis, setPis] = useState('');
    const [matriculation, setMatriculation] = useState('');

    const [errorText, setErrorText] = useState('');
    const [textErrorPis, setTextErrorPis] = useState('');

    const { enqueueSnackbar } = useSnackbar();

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

    async function handleCreate(e) {
        e.preventDefault();
        debugger
        var zero = '';
        for (var i = 1; i <= 16 - matriculation.length; i++) {
            zero += '0';
        }
        var registration = zero + matriculation;

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
                enqueueSnackbar('Colaborador cadastrado com sucesso!', snackbarSuccess);
                setName('');
                setPis('');
                setMatriculation('');
            } catch (err) {
                console.log(err.response.data);
                if (err.response.data.error === "pis already registered") {
                    enqueueSnackbar('Este PIS já foi cadastrado!', snackbarError);
                } else {
                    enqueueSnackbar('Erro ao cadastrar o colaborador!', snackbarError);
                }
                setErrorText('');
            }
        }
    }

    return (
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title" maxWidth="sm">
                <DialogTitle id="form-dialog-title">Criar Colaborador</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Insira os dados para criar um novo colaborador.
                    </DialogContentText>
                    <Grid item sm={12}>
                        {errorText && <Typography style={error}>{errorText}</Typography>}
                    </Grid>
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
                        inputProps={{ maxLength: 12 }}
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
                        inputProps={{ maxLength: 16 }}
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
        </div>
    );
}