import React from 'react';
import './menu.css';
import * as firebase from 'firebase';
import $ from 'jquery'
import './newNumeroPage.css'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";


export class AdminNumeroPane extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            numState: false,
            numeros: null,
        };
    }

    componentDidMount() {
        firebase.database().ref(`/numero`).once('value').then(s => {
            this.setState({numState: true, numeros: s.val()});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.numState !== this.state.numState) {
            let inside = [];
            if (this.state.numState) {
                for (let key in this.state.numeros) {
                    let base = this.state.numeros[key];
                    inside.push(<NumeroElement key={key} title={base.title} data={base}/>)
                }
            } else {
                inside = 'Loading...';
            }
            this.setState({elements: inside});
        }
    }

    render() {

        return (<div>
            <div className="admin-numero new-numero container">
                <div className="admin-numero new-numero title">Créer un nouveau numéro</div>
                <NewNumero/>
            </div>
            <hr/>
            <div className="admin-numero container">
                <div className="admin-numero inside">{this.state.elements}</div>
            </div>
        </div>)
    }
}

class NumeroElement extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {
        return (
            <div className="numero-element container" id={this.props.key} style={{order: (999 - this.props.data.ord)}}>
                <div className="numero-element title">{this.props.title}</div>
                <div className="numero-element control-panel">
                    <RemoveNumero key={this.props.key}/>
                    <EditNumero key={this.props.key}/>
                </div>
            </div>)
    }
}

class RemoveNumero extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {
        return (<div className="remove-button container"><i className="material-icons remove-button">
            restore_from_trash
        </i></div>);
    }
}

class EditNumero extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {
        return (<div className="edit-button container"><i className="material-icons edit-button">
            edit
        </i></div>);
    }
}

class NewNumero extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {

        return (<Link to="/admin/numero/new" className="admin-numero new-numero icon" id="new-button"><i
            className="material-icons new-numero-button">
            note_add
        </i></Link>);
    }
}

export class NumeroDataPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: ''};
    }

    componentDidMount() {
        if (this.props.numState === 'new') {
            document.getElementById('submit-new-numero').addEventListener("click", this.submitHandle.bind(this));
        }
    }

    componentWillUnmount() {
        if (this.props.numState === 'new') {
            document.getElementById('submit-new-numero').removeEventListener("click", this.submitHandle.bind(this));
        }
    }

    submitHandle() {
        if ($('#new-numero-title-ınput').val() === '') {
            this.setState({error: 'Titre est null'});
            return;
        } else {
            this.setState({error: ''});
            let db = firebase.database();
            let data = {
                articles: {},
                title: $('#new-numero-title-ınput').val(),
                publish: $('#new-numero-publish-ınput').is(":checked"),
                coordonnateur: $('#new-numero-coordonnateur-ınput').val(),
                ord: null,
            }
            db.ref('/conf/numCount').once('value').then(s => {
                data.ord = s.val();
                console.log(data);
            }).then(() => {
                    db.ref('/numero').push(data).then(s => {
                        db.ref('/conf/numCount').set(data.ord + 1);
                    });
                }
            );

        }
    }

    render() {
        if (this.props.numState === 'new') {
            return (<div className="new-numero-page container">
                <div className="new-numero-page inside">
                    <div className="new-numero-page error">{this.state.error}</div>
                    <div>
                        <strong>Titre:</strong><input type="text" id="new-numero-title-ınput"
                                                      className="new-numero text-input"/></div>
                    <div><strong>Coordonnateur:</strong><input type="text" id="new-numero-coordonnateur-ınput"
                                                               value="Coordonnateur de ce numéro : "
                                                               className="new-numero text-input"/>
                    </div>
                    <div><strong>Publish:</strong><input type="checkbox" id="new-numero-publish-ınput"/></div>
                    <div>
                        <button id="submit-new-numero">Submit</button>
                    </div>
                </div>
            </div>);
        }
        if (this.props.numState === 'edit') {
            return (<div>hello</div>);
        }
        return (<div></div>);
    }
}