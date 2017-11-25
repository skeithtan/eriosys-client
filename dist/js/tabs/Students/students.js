"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _graphql = require("../../graphql");

var _graphql2 = _interopRequireDefault(_graphql);

var _student_list = require("./student_list");

var _student_list2 = _interopRequireDefault(_student_list);

var _student_detail = require("./student_detail");

var _student_detail2 = _interopRequireDefault(_student_detail);

var _modals = require("./modals");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tabs = [{
    name: "Inbound",
    image: "./images/inboundgrey.png",
    activeImage: "./images/inboundgreen.png"
}, {
    name: "Outbound",
    image: "./images/airplanegrey.png",
    activeImage: "./images/airplanegreen.png"
}];

function fetchStudents(category, onResult) {
    _graphql2.default.query("\n    {\n        students(category:\"" + category + "\") {\n            id\n            id_number\n            family_name\n            first_name\n            middle_name\n        }\n    }\n    ").then(onResult);
}

var Students = function (_Component) {
    _inherits(Students, _Component);

    function Students(props) {
        _classCallCheck(this, Students);

        var _this = _possibleConstructorReturn(this, (Students.__proto__ || Object.getPrototypeOf(Students)).call(this, props));

        _this.state = {
            allStudents: null,
            activeStudent: null,
            addStudentIsShowing: false,
            activeTab: tabs[0]
        };

        _this.onAddStudent = _this.onAddStudent.bind(_this);
        _this.setActiveTab = _this.setActiveTab.bind(_this);
        _this.setActiveStudent = _this.setActiveStudent.bind(_this);
        _this.toggleAddStudent = _this.toggleAddStudent.bind(_this);
        _this.refreshStudents = _this.refreshStudents.bind(_this);
        _this.onDeleteActiveStudent = _this.onDeleteActiveStudent.bind(_this);

        var category = _this.state.activeTab.name === "Inbound" ? "IN" : "OUT";

        fetchStudents(category, function (result) {
            _this.setState({
                allStudents: result.students
            });
        });
        return _this;
    }

    _createClass(Students, [{
        key: "setActiveTab",
        value: function setActiveTab(tab) {
            var _this2 = this;

            this.setState({
                activeTab: tab,
                activeStudent: null //Student is no longer in the same category
            });

            var category = tab.name === "Inbound" ? "IN" : "OUT";

            fetchStudents(category, function (result) {
                _this2.setState({
                    allStudents: result.students
                });
            });
        }
    }, {
        key: "onAddStudent",
        value: function onAddStudent(student) {
            // Only set new student as active if user is currently looking at inbounds
            // Only inbound because the only type of student you can add here is inbound
            if (this.state.tab.name === "Inbound") {
                this.setState({
                    activeStudent: student
                });
            }
        }
    }, {
        key: "refreshStudents",
        value: function refreshStudents() {
            this.setActiveTab(this.state.activeTab);
        }
    }, {
        key: "onDeleteActiveStudent",
        value: function onDeleteActiveStudent() {
            this.setState({
                activeStudent: null
            });

            this.refreshStudents();
        }
    }, {
        key: "toggleAddStudent",
        value: function toggleAddStudent() {
            this.setState({
                addStudentIsShowing: !this.state.addStudentIsShowing
            });
        }
    }, {
        key: "setActiveStudent",
        value: function setActiveStudent(student) {
            this.setState({
                activeStudent: student
            });
        }
    }, {
        key: "render",
        value: function render() {
            var addButtonIsShowing = this.state.activeTab.name === "Inbound";

            return _react2.default.createElement(
                "div",
                { className: "container-fluid d-flex flex-row p-0 h-100" },
                _react2.default.createElement(_student_list2.default, { students: this.state.allStudents,
                    activeStudent: this.state.activeStudent,
                    setActiveStudent: this.setActiveStudent,
                    toggleAddStudent: this.toggleAddStudent,
                    setActiveTab: this.setActiveTab,
                    activeTab: this.state.activeTab,
                    addButtonIsShowing: addButtonIsShowing,
                    tabs: tabs }),
                _react2.default.createElement(_student_detail2.default, { student: this.state.activeStudent,
                    onDeleteActiveStudent: this.onDeleteActiveStudent,
                    refreshStudents: this.refreshStudents }),
                _react2.default.createElement(_modals.StudentFormModal, { isOpen: this.state.addStudentIsShowing,
                    toggle: this.toggleAddStudent,
                    onAddStudent: this.onAddStudent,
                    refresh: this.refreshStudents })
            );
        }
    }]);

    return Students;
}(_react.Component);

exports.default = Students;
//# sourceMappingURL=students.js.map