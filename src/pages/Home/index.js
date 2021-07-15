import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import PeopleIcon from '@material-ui/icons/People';
import api from '../../services/api';
import UpdateCollaborator from "../../components/UpdateCollaborator";
import DeleteCollaborator from "../../components/DeleteCollaborator";
import CreateCollaborator from "../../components/CreateCollaborator";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: '#2b2b2b',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        background: '#2b2b2b',
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    avatar: {
        margin: 10,
    },
    colorText: {
        color: 'white',
    }
}));

const paperStyle = {
    padding: 20,
    marginBottom: 20
}

const greenButton = {
    background: "#2e7d32"
}

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
    const [searchData, setSearchData] = useState([]);

    const [project, setProject] = useState('');

    const history = useHistory();

    const classes = useStyles();


    const [openDialogName, setOpenDialog] = React.useState(false);
    const handleClose = () => setOpenDialog(false);

    const openCreateDialog = () => {
        setOpenDialog('CREATE');
    }
    const openSearchDialog = () => {
        setProject('');
        setOpenDialog('SEARCH');
    }

    const handleLogout = () => {
        localStorage.setItem("token", "");
        localStorage.setItem("name", "");
        localStorage.setItem("id", "");
        history.push("/")
    }

    useEffect(() => {
        handleShowCollaborators();
    }, []);

    async function handleShowCollaborators() {
        setCollaborators([]);
        var id, nome, pis, matricula;
        const data = [];
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
            }
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
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>
                            <ListItem button>
                                <ListItemIcon>
                                    <PeopleIcon className={classes.colorText} />
                                </ListItemIcon>
                                <ListItemText className={classes.colorText} primary="Colaboradores" />
                            </ListItem>

                            <ListItem onClick={handleLogout} button>
                                <ListItemIcon>
                                    <ArrowBackIcon className={classes.colorText} />
                                </ListItemIcon>
                                <ListItemText className={classes.colorText} primary="Sair" />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
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
                                <Button variant="contained" color="primary" onClick={openSearchDialog}>
                                    Buscar Projeto
                                </Button>
                            </Grid>
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
