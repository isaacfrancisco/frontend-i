import { makeStyles } from '@material-ui/core/styles';

export const error = {
    color: 'red',
    fontSize: '12px',
    position: 'relative'
}

export const snackbarSuccess = {
    variant: 'success',
    autoHideDuration: 2000,
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
    }
}

export const snackbarError = {
    variant: 'error',
    autoHideDuration: 2000,
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
    }
}

export const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

export const activeStyle = {
    borderColor: '#2196f3'
};

export const acceptStyle = {
    borderColor: '#00e676'
};

export const rejectStyle = {
    borderColor: '#ff1744'
};

export const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
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
    },
    link: {
        textDecoration: 'none',
    }
}));

export const paperStyle = {
    padding: 20,
    marginBottom: 20
}

export const greenButton = {
    background: "#2e7d32"
}


