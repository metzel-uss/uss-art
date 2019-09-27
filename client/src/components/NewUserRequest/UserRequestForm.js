import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    formControl: {
        width: '100%',
    },
    container: {
        padding: theme.spacing(2),
    },
    banner: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        fontWeight: 'bold',
        padding: theme.spacing(1),
        textAlign: 'left',
        fontSize: theme.typography.pxToRem(15),
    },
    formElement: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    textInput: {
        margin: 0,
    },
    standardFont: {
        fontWeight: 'initial',
    },
    heavyFont: {
        fontWeight: 'bold'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    selectLabel: {
        backgroundColor: 'white',
        paddingRight: '6px',
    },
    textArea: {
        width: '100%',
        minHeight: '140px',
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

export const Form = props => {
    const {
        values:{firstName,
            middleInitial,
            lastName,
            jobTitle,
            region,
            effectiveDate,
            address,
            city,
            state,
            zipCode,
            department,
            employmentType,
            expDate,
            computerType,
            workstationSetup,
            internetAndEmail,
            userName,
            networkDrives,
            owaAccess,
            specialitySoftware,
            ussRemote,
            mirrorAccessFor,
            deskLocation,
            deskPhone,
            extension,
            faxNumber,
            voicemail,
            gotoMeeting,
            mobile,
            defaultPrinter,
            printer2,
            printer3,
            notes,
        },
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
        isValid,
        setFieldTouched,
        setFieldValue
    } = props;

    console.table(props);

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const change = (e) => {
        e.persist();
        handleChange(e);
    };

    const handlePanelChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <form onSubmit={handleSubmit}>
                <div className={classes.banner}>
                    <Typography className={classes.heading}>Requestor Information</Typography>
                </div>
                <div className={classes.container}>
                    <Typography className={`${classes.heading} ${classes.heavyFont}`}>Requestor: <span className={classes.standardFont}>Lastname, Firstname</span></Typography>
                    <Typography className={`${classes.heading} ${classes.heavyFont}`}>E-Mail: <span className={classes.standardFont}>abc@unitedsiteservices.com</span></Typography>
                    <Typography className={`${classes.heading} ${classes.heavyFont}`}>Telephone: <span className={classes.standardFont}>(913)555-1212</span></Typography>
                </div>
                <div className={classes.banner}>
                    <Typography className={classes.heading}>Required Employee Information</Typography>
                </div>
                <div className={classes.root}>
                    <Grid container spacing={10} className={classes.employeeInfoSection}>
                        <Grid item xs={12}>
                            <div className={classes.container}>
                                <div className={classes.root}>
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} sm={5}>
                                            <FormControl className={classes.formControl}>
                                                <TextField
                                                    name="firstName"
                                                    id="first-name"
                                                    label="First Name"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    helperText={touched.firstName ? errors.firstName : ""}
                                                    error={touched.firstName && Boolean(errors.firstName)}
                                                    value={firstName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormControl className={classes.formControl}>
                                                <TextField
                                                    name="middleInitial"
                                                    id="middle-initial"
                                                    label="M. I."
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"

                                                    value={middleInitial}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <FormControl className={classes.formControl}>
                                                <TextField
                                                    name="lastName"
                                                    id="last-name"
                                                    label="Last Name"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    helperText={touched.lastName ? errors.lastName : ""}
                                                    error={touched.lastName && Boolean(errors.lastName)}
                                                    value={lastName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <TextField
                                                    name="jobTitle"
                                                    id="job-title"
                                                    margin="normal"
                                                    variant="outlined"
                                                    helperText={touched.jobTitle ? errors.jobTitle : ""}
                                                    error={touched.jobTitle && Boolean(errors.jobTitle)}
                                                    onBlur={handleBlur}
                                                    value={jobTitle}
                                                    onChange={handleChange("jobTitle")}
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    select
                                                    label="Job Title"
                                                >
                                                    <MenuItem>
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value="Terminal">Terminal</MenuItem>
                                                    <MenuItem value="Laptop">Laptop</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <TextField
                                                    name="region"
                                                    id="region"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    select
                                                    helperText={touched.region ? errors.region : ""}
                                                    error={touched.region && Boolean(errors.region)}
                                                    onBlur={handleBlur}
                                                    value={region}
                                                    onChange={handleChange}
                                                    label="Region"
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value="Terminal">Terminal</MenuItem>
                                                    <MenuItem value="Laptop">Laptop</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <KeyboardDatePicker
                                                    name="effectiveDate"
                                                    id="effective-date"
                                                    label="Effective Date"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    helperText={touched.effectiveDate && errors.effectiveDate ? "Effective Date is required" : ""}
                                                    error={touched.effectiveDate && Boolean(errors.effectiveDate)}
                                                    onBlur={handleBlur}
                                                    clearable
                                                    format="MM/dd/yyyy"
                                                    value={effectiveDate}
                                                    onChange={date => {
                                                        setFieldValue('effectiveDate', date);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <FormControl className={classes.formControl}>
                                                <TextField
                                                    name="address"
                                                    id="address"
                                                    label="Address"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"

                                                    value={address}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <FormControl className={classes.formControl}>
                                                <TextField
                                                    name="city"
                                                    id="city"
                                                    label="city"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"

                                                    value={city}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormControl className={classes.formControl}>
                                                <TextField
                                                    name="state"
                                                    id="state"
                                                    label="state"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"

                                                    value={state}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <FormControl className={classes.formControl}>
                                                <TextField
                                                    name="zipCode"
                                                    id="zip-code"
                                                    label="Zip Code"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"

                                                    value={zipCode}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <TextField
                                                    name="internetAndEmail"
                                                    id="internet-and-email"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    helperText={touched.internetAndEmail ? errors.internetAndEmail : ""}
                                                    error={touched.internetAndEmail && Boolean(errors.internetAndEmail)}
                                                    onBlur={handleBlur}
                                                    key={internetAndEmail}
                                                    value={internetAndEmail}
                                                    onChange={handleChange}
                                                    select
                                                    label="Internet And eMail"
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <TextField
                                                    name="department"
                                                    id="department"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    helperText={touched.department ? errors.department : ""}
                                                    error={touched.department && Boolean(errors.department)}
                                                    onBlur={handleBlur}
                                                    key={department}
                                                    value={department}
                                                    onChange={handleChange}
                                                    select
                                                    label="Department"
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <TextField
                                                    name="employmentType"
                                                    id="employment-type"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    helperText={touched.employmentType ? errors.employmentType : ""}
                                                    error={touched.employmentType && Boolean(errors.employmentType)}
                                                    onBlur={handleBlur}
                                                    select
                                                    value={employmentType}
                                                    onChange={handleChange}
                                                    label="Employment Type"
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </TextField>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl className={classes.formControl}>
                                                <KeyboardDatePicker
                                                    name="expDate"
                                                    id="exp-date"
                                                    label="Exp. Date"
                                                    className={`${classes.formElement} ${classes.textInput}`}
                                                    margin="normal"
                                                    variant="outlined"
                                                    clearable
                                                    format="MM/dd/yyyy"
                                                    value={expDate}
                                                    onChange={date => {
                                                        setFieldValue('expDate', date);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.banner}>
                    <Typography className={classes.heading}>Optional Information</Typography>
                </div>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={handlePanelChange('panel1')}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography className={classes.heading}>Computer</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.root}>
                            <Grid container spacing={6}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="computerType"
                                            id="computer-type"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={computerType}
                                            onChange={handleChange}
                                            label="Computer Type"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="workstationSetup"
                                            id="workstation-setup"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={workstationSetup}
                                            onChange={handleChange}
                                            label="Workstation Setup"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="networkDrives"
                                            id="network-drives"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={networkDrives}
                                            onChange={handleChange}
                                            label="Network Drive"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="specialitySoftware"
                                            id="speciality-software"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={specialitySoftware}
                                            onChange={handleChange}
                                            label="Specialty Software"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="mirrorAccessFor"
                                            id="mirror-access-for"
                                            label="Mirror Access For"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"

                                            value={mirrorAccessFor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="deskLocation"
                                            id="desk-location"
                                            label="Desk Location"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"

                                            value={deskLocation}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={owaAccess}
                                                color="primary"

                                                name="owaAccess"
                                                id="owa-acess"
                                                className={`${classes.formElement} ${classes.textInput}`}
                                                margin="normal"
                                                variant="outlined"

                                                value={owaAccess}
                                                onChange={event => {
                                                    setFieldValue('owaAccess', event.target.checked);
                                                }}
                                            />
                                        }
                                        label="OWA Access"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={ussRemote}
                                                color="primary"

                                                name="ussRemote"
                                                id="uss-remote"
                                                className={`${classes.formElement} ${classes.textInput}`}
                                                margin="normal"
                                                variant="outlined"

                                                value={ussRemote}
                                                onChange={event => {
                                                    setFieldValue('ussRemote', event.target.checked);
                                                }}
                                            />
                                        }
                                        label="USS Remote"
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel2'} onChange={handlePanelChange('panel2')}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Typography className={classes.heading}>Telephone</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.root}>
                            <Grid container spacing={6}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="deskPhone"
                                            id="desk-phone"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={deskPhone}
                                            onChange={handleChange}
                                            label="Desk Phone"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="extension"
                                            id="extension"
                                            label="Extension"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"

                                            value={extension}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="faxNumber"
                                            id="fax-number"
                                            label="Fax Number"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"

                                            value={faxNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="voicemail"
                                            id="voicemail"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={voicemail}
                                            onChange={handleChange}
                                            label="Voicemail"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="gotoMeeting"
                                            id="goto-meeting"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            label="Goto Meeting"
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={gotoMeeting}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <TextField
                                            name="mobile"
                                            id="mobile"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            label="Mobile"
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            value={mobile}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Terminal">Terminal</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel3'} onChange={handlePanelChange('panel3')}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                    >
                        <Typography className={classes.heading}>Printers</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.root}>
                            <Grid container spacing={6}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="defaultPrinter"
                                            id="default-printer"
                                            label="Default Printer"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"

                                            value={defaultPrinter}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="printer2"
                                            id="printer-2"
                                            label="Printer 2"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"

                                            value={printer2}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="printer3"
                                            id="printer-3"
                                            label="Printer 3"
                                            className={`${classes.formElement} ${classes.textInput}`}
                                            margin="normal"
                                            variant="outlined"

                                            value={printer3}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel4'} onChange={handlePanelChange('panel4')}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Typography className={classes.heading}>Other</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>

                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel5'} onChange={handlePanelChange('panel5')}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Typography className={classes.heading}>Additional Requests/Notes</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.root}>
                            <Grid container spacing={6}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl className={classes.formControl}>
                                        <TextareaAutosize
                                            rowsMax={8}
                                            aria-label="notes"
                                            placeholder=""
                                            defaultValue=""
                                            className={classes.textArea}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <Button
                    type="submit"
                    fullWidth
                    variant="raised"
                    color="primary"
                >
                    Submit
                </Button>
            </form>
        </MuiPickersUtilsProvider>
    );
}
