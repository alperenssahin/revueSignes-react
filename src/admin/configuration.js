import React from 'react';
import $ from 'jquery'
import * as firebase from 'firebase';
import './configuration.css';

export class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {appel: "", appelText: "", mainNum: ""};
    }

    componentDidMount() {
        firebase.database().ref('/conf').once("value").then((s) => {
            this.setState({appel: s.val().appel, appelText: s.val().appelText, mainNum: s.val().mainNum});
        });
        document.getElementById('config-update').addEventListener("click", this.update.bind(this));

    }

    componentWillUnmount() {
        document.getElementById('config-update').removeEventListener("click", this.update.bind(this));

    }

    update() {
        let db = firebase.database();
           db.ref('/conf/appel').set($('#select-appel').val()).then(() => {
                db.ref('/conf/appelText').set($('#appel-text').val()).then(() => {
                    db.ref('/conf/mainNum').set($('#select-numero').val()).then(() => {
                        window.location = '/admin/configuration';
                    });
                });
            });
    }

    render() {
        return (<div>
            <div className={"conf-item-container"}>
                <div className={"conf-item-value"}>
                    <strong>Header Text :</strong>
                    <input type={"text"}
                           id={"appel-text"}
                           value={this.state.appelText}
                           onChange={e => {
                               this.setState({appelText: e.target.value});
                           }}
                    />
                </div>
                <div className={"conf-item-value"}>
                    <strong>Appel Article :</strong>
                    <Opt type={"appel"} active={this.state.appel}/>
                </div>
                <div className={"conf-item-value"}>
                    <strong>Main page num :</strong>
                    <Opt type={"numero"} active={this.state.mainNum}/>
                </div>
                <button id={"config-update"}>Mettre en jour</button>
            </div>
        </div>);
    }
}

class Opt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, active: false}
    }

    componentDidMount() {
        this.setState({active: this.props.active});
        firebase.database().ref('/' + this.props.type).once("value").then(s => {
            this.setState({data: s.val()});

        });
    }

    render() {
        let options = [];
        for (let x in this.state.data) {
            options.push(<option value={x}>{this.state.data[x].title}</option>)
        }
        return (<select id={"select-" + this.props.type} value={this.state.active || this.props.active} onChange={e => {
            this.setState({active: e.target.value});
        }}>{options}</select>);
    }
}