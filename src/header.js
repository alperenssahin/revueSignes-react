import React from 'react';
import './css/header.css';

export class Header extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            container: {
                height: window.innerHeight,
            },
        };
        // this.handleResize=this.handleResize.bind(this);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize.bind(this));

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize.bind(this));
    }

    handleResize() {
        let h = window.innerHeight / 2.3;
        let w = window.innerWidth;

        w <= 600 ? h /= 1.5 :  h <= 185 ? h = 185 : h = h * 1;
        this.setState({container: {height: h}});
    }

    render() {
        return (
            <div className="header" id="container" style={this.state.container}>
                <div className="filter" style={this.state.container}>
                    <div id="appel" className="header"><a href={this.props.base+'/appel'}>Appel à articles (NUMERO 20)</a></div>
                    <div className="header" id="inside" >
                        <a href={this.props.base}><h1 id="title" className="header">Revue, Discours et Société</h1></a>
                        <h5 id="description" className="header">Revue semestrielle en sciences humaines et sociales
                            dédiée à l'analyse des Discours</h5>
                    </div>
                </div>
            </div>
        )
    }
}