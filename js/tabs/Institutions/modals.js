import React, { Component } from "react";
import authorizeXHR from "../../authorization";
import makeInfoToast from "../../dismissable_toast_maker";
import validateForm from "../../form_validator";
import settings from "../../settings";
import iziToast from "izitoast";
import moment from "moment";
import $ from "jquery";

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    InputGroup,
    InputGroupAddon,
    FormFeedback,
} from "reactstrap";


class InstitutionFormModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form : {
                name : "",
                country : "Afghanistan",
                address : "",
                website : "",
                contact_person_email : "",
                contact_person_name : "",
                contact_person_number : "",
                agreement : "B",
            },
        };

        this.getFormErrors = this.getFormErrors.bind(this);
        this.getChangeHandler = this.getChangeHandler.bind(this);

        this.submitAddInstitutionForm = this.submitAddInstitutionForm.bind(this);
        this.submitEditInstitutionForm = this.submitEditInstitutionForm.bind(this);

        if (this.props.edit) {
            // Copy the object, do not equate, otherwise the object changes along with the form.
            Object.assign(this.state.form, props.institution);
        }
    }

    getFormErrors() {
        return validateForm([
            {
                name : "Name",
                characterLimit : 64,
                value : this.state.form.name,
            },
            {
                name : "Address",
                characterLimit : 256,
                value : this.state.form.address,
            },
            {
                name : "Website",
                characterLimit : 256,
                value : this.state.form.website,
            },
            {
                name : "Contact person name",
                characterLimit : 256,
                value : this.state.form.contact_person_name,
                optional : true,
            },
            {
                name : "Contact person number",
                characterLimit : 64,
                value : this.state.form.contact_person_number,
                optional : true,
            },
            {
                name : "Contact person email",
                characterLimit : 256,
                value : this.state.form.contact_person_email,
                optional : true,
                customValidators : [{
                    // isValid checks if the form value is a valid email through this messy regex.
                    // It also lets blank values pass because it's an optional field
                    isValid : fieldValue => fieldValue.length === 0 || /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i.test(fieldValue),
                    errorMessage : fieldName => `${fieldName} must be a valid email.`,
                }],
            },
        ]);
    }

    submitAddInstitutionForm() {
        const dismissToast = makeInfoToast({
            title : "Adding",
            message : "Adding new institution...",
        });
        $.post({
            url : `${settings.serverURL}/institutions/`,
            data : this.state.form,
            beforeSend : authorizeXHR,
            success : () => {
                dismissToast();
                this.props.refresh();
                iziToast.success({
                    title : "Success",
                    message : "Successfully added institution",
                });
            },
            error : response => {
                dismissToast();
                console.log(response);
                iziToast.error({
                    title : "Error",
                    message : "Unable to add institution",
                });
            },
        });

        this.props.toggle();
    }

    submitEditInstitutionForm() {
        const dismissToast = makeInfoToast({
            title : "Editing",
            message : "Editing institution...",
        });

        $.ajax({
            method : "PUT",
            url : `${settings.serverURL}/institutions/${this.state.form.id}/`,
            data : this.state.form,
            beforeSend : authorizeXHR,
            success : () => {
                dismissToast();
                this.props.refresh();
                iziToast.success({
                    title : "Success",
                    message : "Successfully modified institution",
                });
            },
            error : response => {
                dismissToast();
                console.log(response);
                iziToast.error({
                    title : "Error",
                    message : "Unable to edit institution",
                });
            },
        });

        this.props.toggle();
    }

    getChangeHandler(fieldName) {
        const form = this.state.form;

        return event => {
            const value = event.target.value;

            form[fieldName] = value;
            this.setState({
                form : form,
            });
        };
    }

    render() {
        const formErrors = this.getFormErrors();
        const formHasErrors = formErrors.formHasErrors;
        const fieldErrors = formErrors.fieldErrors;

        const countries = settings.countries.map((name, index) =>
            <option key={index}>{name}</option>,
        );

        function isValid(fieldName) {
            return fieldErrors[fieldName].length === 0;
        }

        function fieldError(fieldName) {
            return fieldErrors[fieldName][0];
        }

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} backdrop={true}>
                <ModalHeader toggle={this.props.toggle}>
                    {this.props.edit ? `Edit ${this.state.form.name}` : "Add an Institution"}
                </ModalHeader>
                <ModalBody className="form">
                    <Form>

                        <h5 className="mb-3">Institution Details</h5>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input placeholder="Institution Name"
                                   onChange={this.getChangeHandler("name")}
                                   valid={isValid("Name")}
                                   defaultValue={this.state.form.name}/>
                            <FormFeedback>{fieldError("Name")}</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Country</Label>
                            <Input type="select"
                                   onChange={this.getChangeHandler("country")}
                                   defaultValue={this.state.form.country}>
                                {countries}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label>Address</Label>
                            <Input type="textarea" placeholder="Address"
                                   onChange={this.getChangeHandler("address")}
                                   valid={isValid("Address")}
                                   defaultValue={this.state.form.address}/>
                            <FormFeedback>{fieldError("Address")}</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Website</Label>
                            <InputGroup>
                                <InputGroupAddon>http://</InputGroupAddon>
                                <Input placeholder="Website"
                                       onChange={this.getChangeHandler("website")}
                                       valid={isValid("Website")}
                                       defaultValue={this.state.form.website}/>
                            </InputGroup>
                            <Input type="hidden" value={this.state.form.website}
                                   valid={isValid("Website")}/>
                            <FormFeedback><p>{fieldError("Website")}</p></FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Agreement Type</Label>
                            <Input type="select" onChange={this.getChangeHandler("agreement")}
                                   defaultValue={this.state.form.agreement}>
                                <option value="B">Bilateral</option>
                                <option value="M">Multilateral</option>
                            </Input>
                        </FormGroup>

                        <br/>

                        <h5 className="mb-3">Contact</h5>

                        <FormGroup>
                            <Label>Contact Person</Label>
                            <Input placeholder="Name"
                                   onChange={this.getChangeHandler("contact_person_name")}
                                   valid={isValid("Contact person name")}
                                   defaultValue={this.state.form.contact_person_name}/>
                            <FormFeedback>{fieldError("Contact person name")}</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Contact Email</Label>
                            <Input type="email" placeholder="Email"
                                   onChange={this.getChangeHandler("contact_person_email")}
                                   valid={isValid("Contact person email")}
                                   defaultValue={this.state.form.contact_person_email}/>
                            <FormFeedback>{fieldError("Contact person email")}</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label>Contact Number</Label>
                            <Input placeholder="Number"
                                   onChange={this.getChangeHandler("contact_person_number")}
                                   valid={isValid("Contact person number")}
                                   defaultValue={this.state.form.contact_person_number}/>
                            <FormFeedback>{fieldError("Contact person number")}</FormFeedback>
                        </FormGroup>

                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success"
                            onClick={this.props.edit ? this.submitEditInstitutionForm : this.submitAddInstitutionForm}
                            disabled={formHasErrors}>
                        {this.props.edit ? "Edit" : "Add"}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

class DeleteInstitutionModal extends Component {
    constructor(props) {
        super(props);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    confirmDelete() {
        const dismissToast = makeInfoToast({
            title : "Deleting",
            message : "Deleting institution...",
        });

        $.ajax({
            url : `${settings.serverURL}/institutions/${this.props.institution.id}/`,
            method : "DELETE",
            beforeSend : authorizeXHR,
            success : () => {
                dismissToast();
                this.props.refresh();
                iziToast.success({
                    title : "Success",
                    message : "Institution deleted",
                    progressBar : false,
                });
            },
            error : response => {
                dismissToast();
                console.log(response);
                iziToast.error({
                    title : "Error",
                    message : "Unable to delete institution",
                    progressBar : false,
                });
            },
        });
        this.props.toggle();
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} backdrop={true} id="delete-institution-modal">
                <ModalHeader className="text-danger">Are you sure you want to
                    delete {this.props.institution.name}?</ModalHeader>
                <ModalBody>This cannot be undone.</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.confirmDelete}>Confirm Delete</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

class MemorandumFormModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form : {
                category : "MOA",
                memorandum_file : "",
                date_effective : "",
                date_expiration : "",
                college_initiator : "",
            },
        };

        this.getFormErrors = this.getFormErrors.bind(this);
        this.setupUploadCare = this.setupUploadCare.bind(this);
        this.getChangeHandler = this.getChangeHandler.bind(this);
        this.submitAddMemorandumForm = this.submitAddMemorandumForm.bind(this);
        this.submitEditMemorandumForm = this.submitEditMemorandumForm.bind(this);

        if (this.props.edit) {
            console.log(this.props.memorandum);
            Object.assign(this.state.form, props.memorandum);
        }
    }

    getFormErrors() {
        return validateForm([
            {
                name : "Date effective",
                characterLimit : null,
                value : this.state.form.date_effective,
            },
            {
                name : "File",
                characterLimit : null,
                value : this.state.form.memorandum_file,
            },
        ]);
    }

    getChangeHandler(fieldName) {
        const form = this.state.form;

        return event => {
            const value = event.target.value;

            form[fieldName] = value;
            this.setState({
                form : form,
            });

        };

    }

    setupUploadCare() {
        const widget = uploadcare.SingleWidget("[role=uploadcare-uploader]");
        const form = this.state.form;
        const setMemorandumFile = link => {
            form.memorandum_file = link;
            this.setState({
                form : form,
            });

            console.log(this.state.form);
        };

        widget.onChange(file => {
            if (file) {
                file.done(info => {
                    setMemorandumFile(info.cdnUrl);
                });
            }
        });
    }

    submitAddMemorandumForm() {
        const dismissToast = makeInfoToast({
            title : "Adding",
            message : "Adding new memorandum...",
        });

        $.post({
            url : `${settings.serverURL}/institutions/${this.props.institution.id}/memorandums/`,
            data : this.state.form,
            beforeSend : authorizeXHR,
            success : () => {
                dismissToast();
                this.props.refresh();
                iziToast.success({
                    title : "Success",
                    message : "Successfully added memorandum",
                });
            },
            error : response => {
                dismissToast();
                console.log(response);
                iziToast.error({
                    title : "Error",
                    message : "Unable to add memorandum",
                });
            },
        });

        this.props.toggle();
    }

    submitEditMemorandumForm() {
        const dismissToast = makeInfoToast({
            title : "Editing",
            message : "Editing memorandum...",
        });

        $.ajax({
            method : "PUT",
            url : `${settings.serverURL}/institutions/${this.props.institution.id}/memorandums/${this.state.memorandum.id}/`,
            data : this.state.form,
            beforeSend : authorizeXHR,
            success : () => {
                dismissToast();
                this.props.refresh();
                iziToast.success({
                    title : "Success",
                    message : "Successfully modified memorandum",
                });
            },
            error : response => {
                dismissToast();
                console.log(response);
                iziToast.error({
                    title : "Error",
                    message : "Unable to edit memorandum",
                });
            },
        });

        this.props.toggle();
    }

    render() {
        const formErrors = this.getFormErrors();
        const formHasErrors = formErrors.formHasErrors;
        const fieldErrors = formErrors.fieldErrors;

        function isValid(fieldName) {
            return fieldErrors[fieldName].length === 0;
        }

        function fieldError(fieldName) {
            return fieldErrors[fieldName][0];
        }

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} backdrop={true}
                   onOpened={this.setupUploadCare}>
                <ModalHeader toggle={this.props.toggle}>
                    {this.props.edit ? "Edit memorandum" : `Add a memorandum to ${this.props.institution.name}`}
                </ModalHeader>
                <ModalBody className="form">
                    <Form>
                        <FormGroup>
                            <Label>Category</Label>
                            <Input type="select" defaultValue={this.state.form.category}
                                   onChange={this.getChangeHandler("category")}>
                                <option value="MOA">Memorandum of Agreement</option>
                                <option value="MOU">Memorandum of Understanding</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>File Link</Label>
                            <Input type="hidden" role="uploadcare-uploader" name="content"
                                   data-public-key={settings.uploadcarePublicKey}
                                   valid={isValid("File")}/>
                            <FormFeedback>{fieldError("File")}</FormFeedback>
                            {this.props.edit &&
                            <small className="text-secondary">To change memorandum file, upload a new file. Otherwise,
                                leave this blank.</small>
                            }
                        </FormGroup>
                        <FormGroup>
                            <Label>Date Effective</Label>
                            <Input type="date" defaultValue={this.state.form.date_effective}
                                   onChange={this.getChangeHandler("date_effective")}
                                   valid={isValid("Date effective")}/>
                            <FormFeedback>{fieldError("Date effective")}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label>Expiration Date</Label>
                            <Input type="date" defaultValue={this.state.form.date_expiration}
                                   onChange={this.getChangeHandler("date_expiration")}/>
                            <small className="text-secondary">If the memorandum has no expiration date, leave this
                                blank.
                            </small>
                        </FormGroup>
                        <FormGroup>
                            <Label>College Initiator</Label>
                            <Input type="select" defaultValue={this.state.form.college_initiator}
                                   onChange={this.getChangeHandler("college_initiator")}>
                                <option value="CCS">College of Computer Studies</option>
                                <option value="RVRCOB">Ramon V. del Rosario College of Business</option>
                                <option value="CLA">College of Liberal Arts</option>
                                <option value="SOE">School of Economics</option>
                                <option value="GCOE">Gokongwei College of Engineering</option>
                                <option value="COL">College of Law</option>
                                <option value="BAGCED">Brother Andrew Gonzales College of Education</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="success"
                            disabled={formHasErrors}
                            onClick={this.props.edit ? this.submitEditMemorandumForm : this.submitAddMemorandumForm}>
                        {this.props.edit ? "Edit" : "Add"}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

}

class DeleteMemorandumModal extends Component {
    constructor(props) {
        super(props);

        this.confirmDelete = this.confirmDelete.bind(this);
    }

    confirmDelete() {
        const dismissToast = makeInfoToast({
            title : "Deleting",
            message : "Deleting memorandum...",
        });

        $.ajax({
            url : `${settings.serverURL}/institutions/${this.props.institution.id}/memorandums/${this.props.memorandum.id}`,
            method : "DELETE",
            beforeSend : authorizeXHR,
            success : () => {
                dismissToast();
                this.props.refresh();
                iziToast.success({
                    title : "Success",
                    message : "Memorandum deleted",
                    progressBar : false,
                });
            },
            error : response => {
                dismissToast();
                console.log(response);
                iziToast.error({
                    title : "Error",
                    message : "Unable to delete memorandum",
                    progressBar : false,
                });
            },
        });
        this.props.toggle();
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} backdrop={true} id="delete-memorandum-modal">
                <ModalHeader toggle={this.props.toggle}>Delete Memorandum</ModalHeader>
                <ModalBody>This cannot be undone.</ModalBody>
                <ModalFooter>
                    <Button color="danger" id="delete-memorandum-modal-submit"
                            onClick={this.confirmDelete}>Delete</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export {
    InstitutionFormModal,
    DeleteInstitutionModal,
    MemorandumFormModal,
    DeleteMemorandumModal,
};