"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _graphql = require("../../graphql");

var _graphql2 = _interopRequireDefault(_graphql);

var _reactstrap = require("reactstrap");

var _loading = require("../../components/loading");

var _loading2 = _interopRequireDefault(_loading);

var _section = require("../../components/section");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function fetchOutboundApplication(onResult) {
    _graphql2.default.query("\n    {\n        outbound_student_programs {\n            id\n            student {\n                id\n                id_number\n                first_name\n                middle_name\n                family_name\n            }\n            is_requirements_complete\n        }\n    }\n    ").then(onResult);
}

var StudentApplications = function (_Component) {
    _inherits(StudentApplications, _Component);

    function StudentApplications(props) {
        _classCallCheck(this, StudentApplications);

        return _possibleConstructorReturn(this, (StudentApplications.__proto__ || Object.getPrototypeOf(StudentApplications)).call(this, props));
    }

    _createClass(StudentApplications, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "container-fluid d-flex flex-row p-0 h-100" },
                _react2.default.createElement(StudentApplicationsList, null)
            );
        }
    }]);

    return StudentApplications;
}(_react.Component);

var StudentApplicationsList = function (_Component2) {
    _inherits(StudentApplicationsList, _Component2);

    function StudentApplicationsList(props) {
        _classCallCheck(this, StudentApplicationsList);

        var _this2 = _possibleConstructorReturn(this, (StudentApplicationsList.__proto__ || Object.getPrototypeOf(StudentApplicationsList)).call(this, props));

        _this2.state = {
            activeCategory: "Incomplete",
            applicants: null,
            activeApplicant: null
        };

        fetchOutboundApplication(function (result) {
            _this2.setState({
                applicants: result.outbound_student_programs
            });
        });

        _this2.setActiveCategory = _this2.setActiveCategory.bind(_this2);
        _this2.getApplicantsByCategory = _this2.getApplicantsByCategory.bind(_this2);
        _this2.setActiveApplicant = _this2.setActiveApplicant.bind(_this2);
        return _this2;
    }

    _createClass(StudentApplicationsList, [{
        key: "setActiveCategory",
        value: function setActiveCategory(category) {
            this.setState({
                activeCategory: category
            });

            this.getApplicantsByCategory(this.state.applicants);
        }
    }, {
        key: "getApplicantsByCategory",
        value: function getApplicantsByCategory(applicants) {
            var _this3 = this;

            if (applicants === null) {
                return null;
            }

            var filteredApplicants = [];

            applicants.forEach(function (applicant) {
                if (_this3.state.activeCategory === "Incomplete") {
                    if (!applicant.is_requirements_complete) {
                        filteredApplicants.push(applicant);
                    }
                } else {
                    if (applicant.is_requirements_complete) {
                        filteredApplicants.push(applicant);
                    }
                }
            });

            return filteredApplicants;
        }

        // TODO: refreshing the applicants and at the same time conforming to the activeCategory

    }, {
        key: "setActiveApplicant",
        value: function setActiveApplicant(applicant) {
            this.setState({
                activeApplicant: applicant
            });
        }
    }, {
        key: "render",
        value: function render() {
            var applicants = this.getApplicantsByCategory(this.state.applicants);

            return _react2.default.createElement(
                "div",
                { className: "sidebar h-100" },
                _react2.default.createElement(StudentApplicationsListHead, { activeCategory: this.state.activeCategory,
                    setActiveCategory: this.setActiveCategory }),
                _react2.default.createElement(StudentApplicationsListTable, { activeCategory: this.state.activeCategory,
                    applicants: applicants,
                    activeApplicant: this.state.activeApplicant,
                    setActiveApplicant: this.setActiveApplicant })
            );
        }
    }]);

    return StudentApplicationsList;
}(_react.Component);

var StudentApplicationsListHead = function (_Component3) {
    _inherits(StudentApplicationsListHead, _Component3);

    function StudentApplicationsListHead(props) {
        _classCallCheck(this, StudentApplicationsListHead);

        return _possibleConstructorReturn(this, (StudentApplicationsListHead.__proto__ || Object.getPrototypeOf(StudentApplicationsListHead)).call(this, props));
    }

    _createClass(StudentApplicationsListHead, [{
        key: "render",
        value: function render() {
            var _this5 = this;

            return _react2.default.createElement(
                "div",
                { className: "page-head" },
                _react2.default.createElement(
                    "div",
                    { className: "page-head-controls" },
                    _react2.default.createElement(
                        "div",
                        { className: "btn-group", role: "group" },
                        _react2.default.createElement(
                            _reactstrap.Button,
                            { outline: true,
                                color: "success",
                                size: "sm",
                                onClick: function onClick() {
                                    return _this5.props.setActiveCategory("Incomplete");
                                },
                                active: this.props.activeCategory === "Incomplete" },
                            "Incomplete"
                        ),
                        _react2.default.createElement(
                            _reactstrap.Button,
                            { outline: true,
                                color: "success",
                                size: "sm",
                                onClick: function onClick() {
                                    return _this5.props.setActiveCategory("Complete");
                                },
                                active: this.props.activeCategory === "Complete" },
                            "Complete"
                        )
                    ),
                    _react2.default.createElement(
                        _reactstrap.Button,
                        { outline: true,
                            color: "success",
                            className: "ml-auto",
                            size: "sm" },
                        "Add Applicant"
                    )
                ),
                _react2.default.createElement(
                    "h4",
                    { className: "page-head-title" },
                    this.props.activeCategory,
                    " Applications"
                ),
                _react2.default.createElement(_reactstrap.Input, { type: "search",
                    placeholder: "search",
                    className: "search-input" })
            );
        }
    }]);

    return StudentApplicationsListHead;
}(_react.Component);

var StudentApplicationsListTable = function (_Component4) {
    _inherits(StudentApplicationsListTable, _Component4);

    function StudentApplicationsListTable(props) {
        _classCallCheck(this, StudentApplicationsListTable);

        var _this6 = _possibleConstructorReturn(this, (StudentApplicationsListTable.__proto__ || Object.getPrototypeOf(StudentApplicationsListTable)).call(this, props));

        _this6.getStudentsByFamilyNameInitials = _this6.getStudentsByFamilyNameInitials.bind(_this6);
        _this6.emptyState = _this6.emptyState.bind(_this6);
        return _this6;
    }

    _createClass(StudentApplicationsListTable, [{
        key: "getStudentsByFamilyNameInitials",
        value: function getStudentsByFamilyNameInitials() {
            if (this.props.applicants === null) {
                return null;
            }

            var applicants = [];

            this.props.applicants.forEach(function (applicant) {
                applicants.push(applicant.student);
            });

            //Get first letter
            var familyNameInitials = applicants.map(function (student) {
                return student.family_name[0];
            });

            //Get uniques only
            familyNameInitials = familyNameInitials.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });

            // Sort alphabetically
            familyNameInitials = familyNameInitials.sort(function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });

            var categorizedByInitial = [];

            // Categorize by family name initial
            familyNameInitials.forEach(function (initial) {
                var categorizedApplicants = [];
                categorizedByInitial.push({
                    initial: initial,
                    applicants: categorizedApplicants
                });

                applicants.forEach(function (applicant) {
                    var studentInitial = applicant.family_name[0];

                    if (studentInitial === initial) {
                        categorizedApplicants.push(applicant);
                    }
                });
            });
            return categorizedByInitial;
        }
    }, {
        key: "emptyState",
        value: function emptyState() {
            return _react2.default.createElement(
                "div",
                { className: "loading-container" },
                _react2.default.createElement(
                    "h4",
                    null,
                    "There are no ",
                    this.props.activeCategory,
                    " applicants."
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _this7 = this;

            if (this.props.applicants === null) {
                return _react2.default.createElement(_loading2.default, null);
            }

            if (this.props.applicants.length === 0) {
                return this.emptyState();
            }

            var familyNameInitials = this.getStudentsByFamilyNameInitials();

            var sections = familyNameInitials.map(function (familyNameInitial, index) {
                return _react2.default.createElement(StudentApplicationsListSection, { key: index,
                    title: familyNameInitial.initial,
                    activeApplicant: _this7.props.activeApplicant,
                    applicants: familyNameInitial.applicants,
                    setActiveApplicant: _this7.props.setActiveApplicant });
            });

            return _react2.default.createElement(
                "div",
                { className: "page-body" },
                sections
            );
        }
    }]);

    return StudentApplicationsListTable;
}(_react.Component);

var StudentApplicationsListSection = function (_Component5) {
    _inherits(StudentApplicationsListSection, _Component5);

    function StudentApplicationsListSection(props) {
        _classCallCheck(this, StudentApplicationsListSection);

        return _possibleConstructorReturn(this, (StudentApplicationsListSection.__proto__ || Object.getPrototypeOf(StudentApplicationsListSection)).call(this, props));
    }

    _createClass(StudentApplicationsListSection, [{
        key: "render",
        value: function render() {
            var _this9 = this;

            var rows = this.props.applicants.map(function (applicant, index) {
                var isActive = false;

                if (_this9.props.activeApplicant !== null) {
                    isActive = _this9.props.activeApplicant.id.toString() === applicant.id.toString();
                }

                var setActiveApplicant = function setActiveApplicant() {
                    return _this9.props.setActiveApplicant(applicant);
                };

                return _react2.default.createElement(
                    _section.SectionRow,
                    { selectable: true,
                        onClick: setActiveApplicant,
                        active: isActive,
                        key: index },
                    _react2.default.createElement(
                        "small",
                        { className: "d-block" },
                        applicant.id_number
                    ),
                    _react2.default.createElement(
                        "b",
                        null,
                        applicant.family_name
                    ),
                    ", ",
                    applicant.first_name,
                    " ",
                    applicant.middle_name
                );
            });

            return _react2.default.createElement(
                _section.Section,
                null,
                _react2.default.createElement(
                    _section.SectionTitle,
                    null,
                    this.props.title
                ),
                _react2.default.createElement(
                    _section.SectionTable,
                    null,
                    rows
                )
            );
        }
    }]);

    return StudentApplicationsListSection;
}(_react.Component);

exports.default = StudentApplications;
//# sourceMappingURL=student_applications.js.map