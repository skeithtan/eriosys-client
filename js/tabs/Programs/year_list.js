import React, { Component } from "react";
import LoadingSpinner from "../../components/loading";
import { AcademicYearFormModal } from "./modals";
import { Button } from "reactstrap";

import {
    SectionRow,
    SectionRowContent,
    SectionTable,
} from "../../components/section";


class YearList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addAcademicYearIsShowing : false,
        };

        this.getArrangedYears = this.getArrangedYears.bind(this);
        this.toggleAddAcademicYear = this.toggleAddAcademicYear.bind(this);
    }

    toggleAddAcademicYear() {
        this.setState({
            addAcademicYearIsShowing : !this.state.addAcademicYearIsShowing,
        });
    }

    getArrangedYears() {
        if (this.props.yearList === null) {
            return [];
        }

        let years = [];

        this.props.yearList.forEach(year => {
            years.push(year.academic_year_start);
        });

        // Get uniques only
        years = years.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        // Arrange in ascending order
        years = years.sort(function (a, b) {
            return a - b;
        });

        return years;
    }

    render() {
        const years = this.getArrangedYears();

        return (
            <div className="sidebar h-100"
                 id="term-list">
                <YearListHead toggleAddAcademicYear={this.toggleAddAcademicYear}/>
                <YearListTable yearList={years}
                               activeYear={this.props.activeYear}
                               setActiveYear={this.props.setActiveYear}/>
                <AcademicYearFormModal toggle={this.toggleAddAcademicYear}
                                       isOpen={this.state.addAcademicYearIsShowing}/>
            </div>
        );
    }
}

class YearListHead extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-head">
                <div className="page-head-controls">
                    <Button outline
                            color="success"
                            size="sm"
                            className="ml-auto"
                            onClick={this.props.toggleAddAcademicYear}>Add</Button>
                </div>
                <h4 className="page-head-title mb-0">Academic Years</h4>
            </div>
        );
    }
}

class YearListTable extends Component {
    constructor(props) {
        super(props);
    }

    emptyState() {
        return (
            <div className="loading-container">
                <h4>There's nothing here.</h4>
            </div>
        );
    }

    render() {
        if (this.props.yearList === null) {
            return <LoadingSpinner/>;
        }

        if (this.props.yearList.length === 0) {
            return this.emptyState();
        }

        const rows = this.props.yearList.map((year, index) => {
            let isActive = false;

            if (this.props.activeYear !== null) {
                isActive = this.props.activeYear === year;
            }

            const setActiveYear = () => this.props.setActiveYear(year);

            const yearStart = Number(year);
            return <SectionRow selectable
                               key={index}
                               onClick={setActiveYear}
                               active={isActive}>
                <SectionRowContent>{yearStart} - {yearStart + 1}</SectionRowContent>
            </SectionRow>;
        });

        return (
            <div className="page-body">
                <SectionTable>
                    {rows}
                </SectionTable>
            </div>
        );
    }
}

export default YearList;