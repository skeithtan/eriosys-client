"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Institutions = function (_Component) {
    _inherits(Institutions, _Component);

    function Institutions(props) {
        _classCallCheck(this, Institutions);

        return _possibleConstructorReturn(this, (Institutions.__proto__ || Object.getPrototypeOf(Institutions)).call(this, props));
    }

    _createClass(Institutions, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement("div", { className: "h-100 d-flex flex-column" });
        }
    }]);

    return Institutions;
}(_react.Component);

var InstitutionListHead = function (_Component2) {
    _inherits(InstitutionListHead, _Component2);

    function InstitutionListHead() {
        _classCallCheck(this, InstitutionListHead);

        return _possibleConstructorReturn(this, (InstitutionListHead.__proto__ || Object.getPrototypeOf(InstitutionListHead)).apply(this, arguments));
    }

    return InstitutionListHead;
}(_react.Component);
//# sourceMappingURL=institutions.js.map
//# sourceMappingURL=institutions.js.map