import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Button from "@material-ui/core/Button";
import Navigation from './Navigation'
import Grid from '@material-ui/core/Grid';

import DragAndDrop from "./DragAndDrop";


const drawerWidth = 350;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginTop: '55px'
    },
    toolbar: theme.mixins.toolbar,
    preview: {
        float: 'right'
    },
    subtext: {
        paddingTop: theme.spacing(4),
    },
}));

export default function ClippedDrawer() {
    const classes = useStyles();
    const sectionTitle = 'New User Request';
    const preview = true;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
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
                <Navigation />
            </Drawer>
            <main className={classes.content}>
                <Grid container className={classes.employeeInfoSection}>
                    <Grid item xs={6}>
                        <Typography variant="h6" noWrap>
                            {sectionTitle}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.preview}>
                            {preview ?
                                <Button variant="contained" color="primary">
                                    Preview Form
                                </Button> : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.subtext}>
                        <Typography variant="caption" display="block">
                             Arrange the order of optional items by clicking and dragging their containers.  Selecting the edit button will allow changes to title and form content.  Delete removes the section alogn with all included form elemets.
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <DragAndDrop/>
                    </Grid>
                </Grid>
            </main>
        </div>
    );
}
