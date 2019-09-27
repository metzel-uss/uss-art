import React, { Component } from "react";
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import { Form } from "./UserRequestForm";
import Paper from "@material-ui/core/Paper";
import * as Yup from "yup";

const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    jobTitle: Yup.string().required("Job Title is required"),
    region: Yup.string().required("Region is required"),
    effectiveDate: Yup.string().required("Effective Date is required"),
    internetAndEmail: Yup.string().required("Internet and eMail information are required"),
    department: Yup.string().required("Department is required"),
    employmentType: Yup.string().required("Employment Type is required"),
});

class NewUserRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit = data => {
        console.log('data', data);
    };

    render() {
        const classes = this.props;
        const values = {    firstName: "",
            middleInitial: "",
            lastName: "",
            jobTitle: "",
            region: "",
            effectiveDate: new Date(),
            address: "",
            city: "",
            state: "",
            zipCode: "",
            department: "",
            employmentType: "",
            expDate: new Date(),
            computerType: "",
            internetAndEmail: "",
            workstationSetup: "",
            userName: "",
            networkDrives: "",
            owaAccess: false,
            specialitySoftware: "",
            ussRemote: "",
            mirrorAccessFor: "",
            deskLocation: "",
            deskPhone: "",
            extension: "",
            faxNumber: "",
            voicemail: "",
            gotoMeeting: "",
            mobile: "",
            defaultPrinter: "",
            printer2: "",
            printer3: "",
            notes: ""};
        return (
            <React.Fragment>
                <Formik
                    render={props => <Form {...props} />}
                    initialValues={values}
                    validationSchema={validationSchema}
                    onSubmit={this.submit}
                />
            </React.Fragment>
        );
    }
}

export default (NewUserRequest);
