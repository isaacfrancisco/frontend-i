import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import api from '../../services/api';
import DeleteCollaborator from "../../components/DeleteCollaborator";
import ImportMarking from "../../components/ImportMarking";
import { useStyles, paperStyle, greenButton } from '../../styles';
import { Sidebar } from "../../components/Sidebar";

const columns = ["Registro Sequencial", "Tipo de Ponto", "Colaborador", "Data", "Hora", "Ponto Completo"];

const options = {
    textLabels: {
        body: {
            noMatch: "Nenhum ponto cadastrado",
            toolTip: "Ordenar",
            columnHeaderTooltip: column => `Ordenar por ${column.label}`
        },
        pagination: {
            rowsPerPage: "Linhas por pagina:",
            displayRows: "de",
        }
    },
    filterType: "checkbox",
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    search: false,
    download: false,
    print: false,
    viewColumns: false,
    filter: false
};

export default function Marking() {
    const [markings, setMarkings] = useState([]);

    const classes = useStyles();

    const [openDialogName, setOpenDialog] = React.useState(false);
    const handleClose = () => setOpenDialog(false);

    const openImportDialog = () => {
        setOpenDialog('IMPORT');
    }

    useEffect(() => {
        handleShowCollaborators();
    }, []);

    async function handleShowCollaborators() {
        setMarkings([]);
        var id, registroSequencial, tipoPonto, colaborador, dataPonto, hora, pontoCompleto;
        const data = [];
        try {
            const response = await api.get("/markings");
            console.log(response.data);
            for (let i = 0; i < response.data.markings.length; i++) {
                id = response.data.markings[i].id;
                registroSequencial = response.data.markings[i].sequential_record;
                tipoPonto = response.data.markings[i].marking_type;
                colaborador = response.data.markings[i].collaborator;
                dataPonto = response.data.markings[i].marking_date;
                hora = response.data.markings[i].marking_hour;
                pontoCompleto = response.data.markings[i].completed_marking;

                data.push([
                    registroSequencial,
                    tipoPonto,
                    colaborador,
                    dataPonto,
                    hora,
                    pontoCompleto,
                    <span>
                        <DeleteCollaborator
                            id={id}
                            handleRefresh={(e) => handleRefresh()}
                        />
                    </span>
                ]);
            }
            console.log(data);
            setMarkings(data);
        } catch (err) {
            console.log(err);
        }
    }

    function handleRefresh() {
        handleShowCollaborators();
    }

    return (
        <>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Sistema de Ponto
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Sidebar />
                <main className={classes.content}>
                    <Toolbar />
                    <Paper elevation={3} style={paperStyle}>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                <Button variant="contained" color="primary" style={greenButton} onClick={openImportDialog}>
                                    Importar Pontos
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <MUIDataTable
                        title={"Pontos dos colaboradores"}
                        data={markings}
                        columns={columns}
                        options={options}
                    />
                </main>
                <ImportMarking
                    open={openDialogName === 'IMPORT'}
                    onClose={handleClose}
                    handleRefresh={(e) => handleRefresh()}
                />
            </div>
        </>
    );
}
