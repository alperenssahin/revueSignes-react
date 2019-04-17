import React from 'react';
import './css/navbarContent.css';
import $ from 'jquery'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
// import axios from 'axios'
import * as firebase from 'firebase';
import {Config} from "./configurator";

export class NavContent extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }


    close() {
        $(`.button.inside`).removeClass('active');
        $('.button.inside > i').css('color', "#1d2124");
        $('#res.navBar').css('display', 'none');
        $('.navOutside').css('display', 'none');
    }

    render() {
        return (
            <div className="inside navContent">
                <div className="navContent">
                    <div className="navContent exit bar">
                        <div className="title navContent">{this.props.text}</div>
                        <span className="close icon navContent" onClick={this.close}><i className="material-icons">
                        close
                        </i></span></div>

                    <div className="navContent content">
                        <Items url={this.props.url}/>
                    </div>
                </div>
            </div>
        )
    }
}

export class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {url: null,title:null};
    }

    componentDidMount() {
        window.addEventListener("click", this.click.bind(this));

        // console.log(`${conf.server()}/numeroTitle`);

    }

    componentWillUnmount() {
        window.removeEventListener("click", this.click.bind(this));
    }

    click() {
        let id = $('.button.inside.active');
        let url;
        id.length !== 0 ? url = id[0].id : url = null;
        this.setState({url: url});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let conf = new Config();
        if (prevState.url !== this.state.url) {
            // axios.get(`${conf.server()}/navbar/${this.state.url}`).then(
            //     (r) => {
            //         const title = r.data;
            //         // console.log(title);
            //         this.setState({title});
            //     }
            // );
            let url;
            if (this.state.url === "library") {
                url = 'numero';
            } else {
                url = this.state.url;
            }
            firebase.database().ref(`/${url}`).once("value").then((s) => {
                // console.log(s.val());
                const title = s.val();
                //         // console.log(title);
                this.setState({title});
            });
            console.log(this.state.url, 'changed');
        }
    }

    render() {
        let row = [];
        // console.log(this.state.title);
        let numeros = this.state.title;
        let count;
        if (numeros !== undefined && numeros !== null) {
            count = Object.keys(numeros).length
        } else {
            count = 9999;
        }
        console.log(count);
        if (this.state.url === 'library') {
            for (let y in this.state.title) {
                // console.log(count);
                if(this.state.title[y].publish){
                    row.push(<Item url={'/library/' + y} order={(count) - this.state.title[y].ord}
                                   text={this.state.title[y].title}/>);
                }
            }
        } else {
            for (let y in this.state.title) {

                row.push(<Item url={'/article/' + this.state.title[y].index} order={this.state.title[y].ord}
                               text={this.state.title[y].title}/>);
            }
        }
        return row;
    }
}


class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {order: this.props.order, url: ''}
    }

    render() {
        return (
            <Link className="item link out " style={{order: this.state.order}} to={this.props.url}>
                <div className="item prefix ">''</div>
                <div className="item title ">{this.props.text}</div>
            </Link>
        )
    }
}