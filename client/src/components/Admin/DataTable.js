import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAdd from '@material-ui/icons/NoteAdd';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: '0',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    row: {
        cursor: 'pointer',
    },
    button: {
        margin: theme.spacing(1),
        marginLeft: '0'
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
        marginLeft: theme.spacing(1),
    },
    iconButton: {
        display: 'inline-block'
    }
}));

function createData(name, sortOrder, numOfElements, actions) {
    return { name, sortOrder, numOfElements, actions };
}

const rows = [
    createData('Requestor Information', 1,159,  ),
    createData('Required User Information', 2,237, ),
    createData('Computer', 3, 34,true),
    createData('Telephone', 4, 564,true),
    createData('Other', 5, 75, true),
    createData('Notes', 6, 86,true),
];

export default function SimpleTable() {
    const classes = useStyles();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Section Heading</TableCell>
                                <TableCell align="right">Display Order</TableCell>
                                <TableCell align="right">Number of Form Elements</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow hover key={row.name} className={classes.row}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.sortOrder}</TableCell>
                                    <TableCell align="right">{row.numOfElements}</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right">{row.actions ?
                                        <React.Fragment>
                                                <EditIcon color="primary" className={classes.icon} fontSize="small" className={classes.iconButton}/>
                                                <DeleteIcon color="primary" fontSize="large"  fontSize="small" className={classes.iconButton} />
                                        </React.Fragment> : ''}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary"  size="small" className={classes.button}>
                    <NoteAdd className={clsx(classes.leftIcon, classes.iconSmall)} />
                    Add New Section
                </Button>
            </Grid>
        </Grid>
    );
}
