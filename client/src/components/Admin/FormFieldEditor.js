import React from "react";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    gridContainer: {
        padding: '30px 40px'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: 'white',
    },
    dialogPaper: {
        height: '80vh',
    },
    closeBtn: {
        float: 'right',
        color: 'white',
    },
    formControl: {
        width: '100%',
    },
    divider: {
        borderRight: '1px solid #dbdbdb',
        height: 'calc(80vh - 140px)',
    },
    dropDownOptions: {
        width: '100%',
        padding: '15px',
        border: '1px solid #d0d0d0',
        borderRadius: '4px',
    },
    grayText: {
        color: '#757575'
    }
}));

const formTypes = [
    'Text Area',
    'Text Box',
    'Dropdown',
    'Radio',
    'Checkbox',
    'Multiselect',
    'Date',
    'ADP User'
];

export default function FormFieldEditor({ handleClickOpen, handleClickClose, formEditorOpen }) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        displayName: '',
        formType: '',
        demoFormElement: '',
        selectedDropDownItem: [],
        selectItems: [],
        addSelectItem: '',
    });

    const getFormElement = () => {
        if(values.formType) {
            switch (values.formType) {
                case 'Text Area':
                    return 'text area'
                    break;
                case 'Text Box':
                    return <FormControl className={classes.formControl}>
                        <TextField
                            name="demoFormElement"
                            id="demo-form-element"
                            label={values.displayName}
                            value={values.demoFormElement}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                        />
                    </FormControl>
                    break;
                case 'Dropdown':
                    return  <FormControl className={classes.formControl}>
                        <TextField
                            name="demoFormElement"
                            id="demo-form-element"
                            className={`${classes.formElement} ${classes.textInput}`}
                            margin="normal"
                            variant="outlined"
                            value={values.demoFormElement}
                            onChange={handleChange}
                            select
                            label={values.displayName}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {formTypes.map(title => (
                                <MenuItem key={title} value={title}>
                                    {title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                    break;
                default:
                // code block
            }
        }
    };


    const handleChange = event => {
        console.log('event ', event.target.value)
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleAddSelectItemsClick = event => {
        const newValue = event.target.value;
        const newSelectValues = {...values.selectItems, newValue};
        setValues({ ...values, selectItems: newSelectValues });
    }

    const handleDeleteSelectItemsClick = event => {

    }

    const clearDemoValues = () => {
        setValues({ ...values, demoFormElement: '' });
    };

    console.table(values);

    return (
        <div>
            <Dialog
                onClose={handleClickClose}
                aria-labelledby="customized-dialog-title"
                open={formEditorOpen}
                fullWidth
                maxWidth={'80vw'}
                classes={{ paper: classes.dialogPaper }}
            >
                <AppBar className={classes.appBar} color="primary">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Form Field Editor
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={handleClickClose} aria-label="close" className={classes.closeBtn}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                    <div className={classes.gridContainer}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <FormControl className={classes.formControl}>
                                            <TextField
                                                name="displayName"
                                                id="display-name"
                                                label="Display Name"
                                                margin="normal"
                                                variant="outlined"
                                                value={values.displayName}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl className={classes.formControl}>
                                            <TextField
                                                name="formType"
                                                id="formType"
                                                className={`${classes.formElement} ${classes.textInput}`}
                                                margin="normal"
                                                variant="outlined"
                                                value={values.formType}
                                                onChange={handleChange}
                                                select
                                                label="Form Element Type"
                                                onFocus={clearDemoValues}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {formTypes.map(title => (
                                                    <MenuItem key={title} value={title}>
                                                        {title}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={classes.dropDownOptions}>
                                            <Typography className={classes.grayText}>
                                                Dropdown Menu Options
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={8}>
                                                    <FormControl className={classes.formControl}>
                                                        <TextField
                                                            name="displayName"
                                                            id="display-name"
                                                            label="Dropdown Item Name"
                                                            margin="normal"
                                                            variant="outlined"
                                                            value={values.displayName}
                                                            onChange={handleChange}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Button variant="outlined" color="secondary" onClick={handleAddSelectItemsClick}>
                                                        Add Item
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel htmlFor="select-multiple-checkbox">Drop Down Items</InputLabel>
                                                        <Select
                                                            multiple
                                                            name="selectedDropDownItem"
                                                            value={values.selectedDropDownItem}
                                                            onChange={handleChange}
                                                            input={<Input id="select-multiple-checkbox" />}
                                                            renderValue={selected => selected.join(', ')}
                                                        >
                                                            {values.selectItems.map(name => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={values.selectedDropDownItem.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Button variant="outlined" color="secondary" onClick={handleDeleteSelectItemsClick}>
                                                        Remove Item
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.divider}></div>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                        <Typography style={{paddingLeft: '25px'}}>
                                            Form Element Preview:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingTop: '0', paddingLeft: '70px'}}>
                                        {getFormElement()}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
            </Dialog>
        </div>
    );
}
