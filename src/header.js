import React from 'react';
import './css/header.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import * as firebase from 'firebase';
export class Header extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            container: {
                height: window.innerHeight,
            },
            appel:'',
        };
        // this.handleResize=this.handleResize.bind(this);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize.bind(this));
        // let conf = new Config();
        // axios.get(`${conf.server()}/conf/appel`).then(
        //     (r) => {
        //         const appel = r.data;
        //         this.setState({appel: appel});
        //         // console.log(num);
        //     });
        firebase.database().ref("/conf/appel").once("value").then((s)=>{
            console.log(s.val());
            this.setState({appel: s.val()});
        });

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
                    <div id="appel" className="header"><Link to={'/article/'+this.state.appel}>Appel à articles (NUMERO 20)</Link></div>
                    <div className="header" id="inside" >
                        <a href={this.props.base}><h1 id="title" className="header">Discours, Signes et Sociétés</h1></a>
                        <h5 id="description" className="header">Revue semestrielle en sciences humaines et sociales
                            dédiée à l'analyse des Discours</h5>
                    </div>
                </div>
            </div>

        )
    }
}