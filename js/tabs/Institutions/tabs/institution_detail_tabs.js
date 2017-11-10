import React, { Component } from "react";


class InstitutionDetailTabBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const tabs = this.props.tabs.map((tab, index) => {
            return <InstitutionDetailTab
                tab={tab}
                key={index}
                onClick={() => this.props.setActiveTab(tab)}
                isActive={this.props.activeTab === tab}
            />;
        });

        return (
            <div id="institution-navigation">
                <ul className="p-3 justify-content-center mb-0 d-flex flex-row">
                    {tabs}
                </ul>
            </div>
        );
    }
}


class InstitutionDetailTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const image = this.props.isActive ? this.props.tab.activeImage : this.props.tab.image;
        let textClass = "ml-2 font-weight-bold mb-0 ";
        textClass += this.props.isActive ? "text-dlsu" : "text-secondary";


        return (
            <li className="col-lg-2 d-flex flex-row justify-content-center align-items-center"
                onClick={this.props.isActive ? null : this.props.onClick }>
                <img className="nav-image" src={image}/>
                <small className={textClass}>{this.props.tab.name}</small>
            </li>
        );
    }
}

export default InstitutionDetailTabBar;