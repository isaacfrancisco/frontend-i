import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import { Link } from 'react-router-dom';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { useStyles } from '../../styles';
import Toolbar from '@material-ui/core/Toolbar';

export const Sidebar = () => {

    const classes = useStyles();

    return (
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
                    <Link to="/" className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <PeopleIcon className={classes.colorText} />
                            </ListItemIcon>
                            <ListItemText className={classes.colorText} primary="Colaboradores" />
                        </ListItem>
                    </Link>
                    <Link to="/markings" className={classes.link}>
                        <ListItem button>
                            <ListItemIcon>
                                <PlaylistAddCheckIcon className={classes.colorText} />
                            </ListItemIcon>
                            <ListItemText className={classes.colorText} primary="Pontos" />
                        </ListItem>
                    </Link>
                </List>
            </div>
        </Drawer>
    );
}