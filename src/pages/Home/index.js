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
import UpdateCollaborator from "../../components/UpdateCollaborator";
import DeleteCollaborator from "../../components/DeleteCollaborator";
import CreateCollaborator from "../../components/CreateCollaborator";
import { useStyles, paperStyle, greenButton } from '../../styles';
import { Sidebar } from "../../components/Sidebar";

const columns = ["Nome", "Pis", "Matrícula", "Ações"];

const options = {
    textLabels: {
        body: {
            noMatch: "Nenhum colaborador cadastrado",
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

export default function Home() {
    const [collaborators, setCollaborators] = useState([]);

    const classes = useStyles();

    const [openDialogName, setOpenDialog] = React.useState(false);
    const handleClose = () => setOpenDialog(false);

    const openCreateDialog = () => {
        setOpenDialog('CREATE');
    }

    useEffect(() => {
        handleShowCollaborators();
    }, []);

    async function handleShowCollaborators() {
        setCollaborators([]);
        var id, nome, pis, matricula;
        const data = [];
        const collaborators = [];
        try {
            const response = await api.get("/collaborators");
            for (let i = 0; i < response.data.collaborators.length; i++) {
                id = response.data.collaborators[i].id;
                nome = response.data.collaborators[i].name;
                pis = response.data.collaborators[i].pis;
                matricula = response.data.collaborators[i].registration;

                data.push([
                    nome,
                    pis,
                    matricula,
                    <span>
                        <UpdateCollaborator
                            id={id}
                            nome={nome}
                            pisColaborador={pis}
                            matricula={matricula}
                            handleRefresh={(e) => handleRefresh()}
                        />
                        <DeleteCollaborator
                            id={id}
                            handleRefresh={(e) => handleRefresh()}
                        />
                    </span>
                ]);
                collaborators.push({ nome, pis });
            }
            localStorage.setItem('colaboradores', JSON.stringify(collaborators));
            console.log(data);
            setCollaborators(data);
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
                                <Button variant="contained" color="primary" style={greenButton} onClick={openCreateDialog}>
                                    Cadastrar Colaborador
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <MUIDataTable
                        title={"Colaboradores"}
                        data={collaborators}
                        columns={columns}
                        options={options}
                    />
                </main>
                <CreateCollaborator
                    open={openDialogName === 'CREATE'}
                    onClose={handleClose}
                    handleRefresh={(e) => handleRefresh()}
                />
            </div>
        </>
    );
}
