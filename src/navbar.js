import React from 'react';
import './css/navbar.css';
import $ from 'jquery'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

export class Navbar extends React.Component {
    constructor(prop) {
        super(prop);
        this.Numeros = this.Numeros.bind(this);
        this.appel = this.appel.bind(this);
        this.index = this.index.bind(this);
        this.present = this.present.bind(this);
    }

    componentDidMount() {
        this.navbar();
        window.addEventListener("resize", this.navbar.bind(this));

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.navbar.bind(this));
    }

    navbar() {
        widthHeightControl();
    }

    Numeros({match}) {
        window.openTab = match.url;
        return (
            <div id="res" className="navBar response container">aa</div>
        )
    }

    appel({match}) {
        window.openTab = match.url;
        return (
            <div id="res" className="navBar response container">aa</div>
        )
    }

    index({match}) {
        window.openTab = match.url;
        return (
            <div id="res" className="navBar response container">aa</div>
        )
    }

    present({match}) {
        window.openTab = match.url;
        return (
            <div id="res" className="navBar response container">aa</div>
        )
    }

    render() {
        return (
            <Router>
                <div id="container" className="navBar">
                    <Route path="/Mnumero" component={this.Numeros}/>
                    <Route path="/Mappel" component={this.appel}/>
                    <Route path="/Mindex" component={this.index}/>
                    <Route path="/Mpresentation" component={this.present}/>
                    <div id="inside" className="navBar">
                        <Navigator/>
                    </div>

                </div>
            </Router>
        )
    }
}

class Navigator extends React.Component {
    render() {
        return (
            <div>
                <Buttonn id="search" icon="search" color="whitesmoke" path="/"/>
                <div className="navBar marker search">
                    <hr/>
                </div>
                <Buttonn id="library" icon="library_books" color="#fa4638" path="/Mnumero" text="Numéros récents"/>
                <Buttonn id="appel" icon="open_in_browser" color="#f5ee2c" path="/Mappel" text="Appel à Communication"/>
                <Buttonn id="index" icon="markunread_mailbox" color="#caf5e3" path="/Mindex" text="Accès par index"/>
                <Buttonn id="presentation" icon="more_vert" color="#ffc7c7" path="/Mpresentation" text="Présentation"/>
            </div>
        )
    }
}

class Buttonn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {desingI: {color: "#1d2124"}};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {

        if (window.openTab !== this.props.path) {
            this.setState({desingI: {color: this.props.color}});
            window.openTab = this.props.path;

        } else {
            window.openTab = '/';
            this.setState({desingI: {color: "#1d2124"}});

        }
    }

    render() {
        if (window.openTab === this.props.path) {
            return (

                <div className="navBar button container" id={this.props.id}>
                    <Link to="/">
                        <div className="button inside" style={this.state.desingI} onClick={this.handleClick}>
                            <i
                                className="material-icons" style={this.state.desingI}>
                                {this.props.icon}
                            </i>
                            <div className="button text navBar"> {this.props.text}</div>
                        </div>
                    </Link>
                </div>

            )
        } else {
            return (
                <div className="navBar button container" id={this.props.id}><Link to={this.props.path}>
                    <div className="button inside" onClick={this.handleClick}><i className="material-icons">
                        {this.props.icon}
                    </i>
                        <div className="button text navBar"> {this.props.text}</div>
                    </div>
                </Link>
                </div>
            )
        }

    }

}

class OpenMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id} className="openMenu container">asdasd</div>
        )
    }
}

function widthHeightControl() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let n = $('#inside.navBar');
    let c = $('#container.navBar');
    let r = $('#res.navBar');
    r.innerHeight(h);
    c.innerHeight(h);
    if (w < 300) {
        n.innerWidth(30);
        r.css("left", "33px");
        r.innerWidth(120)
    } else if (w < 600) {
        n.innerWidth(50);
        r.css("left", "53px");
        r.innerWidth(150)
    } else if (w < 900) {
        n.innerWidth(230);
        r.css("left", "233px");
        r.innerWidth(250)
    } else {
        n.innerWidth(230);
        r.css("left", "233px");
        r.innerWidth(250)
    }
}