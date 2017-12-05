import React, { Component } from "react";
import graphql from "../../../graphql";
import ErrorState from "../../../components/error_state";
import LoadingSpinner from "../../../components/loading";
import {
    SectionRow,
    SectionTable,
} from "../../../components/section";
import { Button } from "reactstrap";


function makeRequirementsQuery(isInbound) {
    return graphql.query(`
    {
        ${isInbound ? "inbound_requirements" : "outbound_requirements"} {
            id
            name
        }
    }
    `);
}

function makeInboundApplicationQuery(id) {
    return graphql.query(`
    {
      student(id:${id}) {
                inboundstudentprogram {
                    is_requirements_complete
                    application_requirements {
                        id
                    }
                }
        }
    }
    `);
}

function makeOutboundApplicationQuery(id) {
    return graphql.query(`
    {
      student(id:${id}) {
                outboundstudentprogram {
                    is_requirements_complete
                    application_requirements {
                        id
                    }
                }
        }
    }
    `);
}


class ApplicationRequirements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applicantRequirements : null,
            requirements : null,
            isRequirementsComplete : false,
            errors : null,
        };

        this.fetchRequirements = this.fetchRequirements.bind(this);
        this.fetchRequirements(props.inbound, props.student.id);
    }

    fetchRequirements(inbound, studentId) {
        if (this.state.error) {
            this.setState({
                error : null,
            });
        }

        makeRequirementsQuery(inbound)
            .then(result => this.setState({
                requirements : inbound ? result.inbound_requirements : result.outbound_requirements,
            }))
            .catch(error => this.setState({
                error : error,
            }));

        if (inbound) {
            makeInboundApplicationQuery(studentId)
                .then(result => this.setState({
                    applicantRequirements : result.student.inboundstudentprogram.application_requirements.map(requirement => requirement.id),
                    isRequirementsComplete : result.student.inboundstudentprogram.is_requirements_complete,
                }))
                .catch(error => this.setState({
                    error : error,
                }));
        } else {
            makeOutboundApplicationQuery(studentId)
                .then(result => this.setState({
                    applicantRequirements : result.student.outboundstudentprogram.application_requirements.map(requirement => requirement.id),
                    isRequirementsComplete : result.student.outboundstudentprogram.is_requirements_complete,
                }))
                .catch(error => this.setState({
                    error : error,
                }));
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            applicantRequirements : null,
        });

        this.fetchRequirements(props.inbound, props.student.id);
    }

    render() {
        if (this.state.error) {
            return (
                <ErrorState onRetryButtonClick={() => this.fetchRequirements(this.props.inbound, this.props.student.id)}>
                    {this.state.error.toString()}
                </ErrorState>
            );
        }

        if (this.state.applicantRequirements === null || this.state.requirements === null) {
            return <LoadingSpinner/>;
        }

        return (
            <div className="d-flex flex-column p-0 h-100">
                <ApplicationHead student={this.props.student}
                                 inbound={this.props.inbound}
                                 isRequirementsComplete={this.props.isRequirementsComplete}/>
                <RequirementsBody requirements={this.state.requirements}
                                  applicantRequirements={this.state.applicantRequirements}/>
            </div>
        );
    }
}

class ApplicationHead extends Component {
    render() {
        return (
            <div className="page-head pt-5 d-flex flex-row align-items-center">
                <div className="mr-auto">
                    <h5 className="mb-0 text-secondary">Application Requirements</h5>
                    <h4 className="page-head-title justify-content-left d-inline-block mb-0 mr-2">
                        {this.props.student.first_name} {this.props.student.middle_name} {this.props.student.family_name}
                        <small className="text-muted ml-2">{this.props.student.id_number}</small>
                    </h4>

                    {this.props.isRequirementsComplete &&
                    <Button outline
                            size="sm"
                            color="success">
                        {this.props.inbound ? "Accept " : "Deploy "} Student
                    </Button>
                    }
                </div>
            </div>
        );
    }
}

class RequirementsBody extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const rows = this.props.requirements.map(requirement =>
            <RequirementRow key={requirement.id}
                            done={this.props.applicantRequirements.includes(requirement.id)}
                            requirement={requirement}/>,
        );

        return (
            <SectionTable>
                {rows}
            </SectionTable>
        );
    }
}

class RequirementRow extends Component {
    render() {
        return (
            <SectionRow large
                        className="d-flex flex-row align-items-center">

                {this.props.done &&
                <b className="text-success">✓</b>
                }

                <p className="lead mr-auto mb-0">{this.props.requirement.name}</p>

                {this.props.done &&
                <Button outline
                        color="warning">Mark as undone</Button>
                }

                {!this.props.done &&
                <Button outline
                        color="success">Mark as done</Button>
                }
            </SectionRow>
        );
    }
}

export default ApplicationRequirements;