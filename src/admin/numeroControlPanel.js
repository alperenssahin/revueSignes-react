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
                    inside.push(<NumeroElement numKey={key} title={base.title} data={base}/>)
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
                <div className="admin-numero inside">
                    <div className={"info-numero"}>
                        <h5>Published</h5>
                        <h5>Title</h5>
                        <div className={"info-numero-control"}>
                        <h5>Remove</h5>
                        <h5>Edit</h5>
                        <h5>Articles</h5>
                        </div>
                    </div>
                    {this.state.elements}
                </div>
            </div>
        </div>)
    }
}

class NumeroElement extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {
        let color;
        if(this.props.data.publish){
            color = '#69dd88';

        }else{
            color = '#ee6c64';

        }
        return (
            <div className="numero-element container" id={this.props.numKey}
                 style={{order: (999 - this.props.data.ord)}}>
                <div className={"numero-element index"}>
                <div className={"numero-element publish"} style={{color:color}}><i className="material-icons">
                    fiber_manual_record
                </i></div>
                    <div className="numero-element title">{this.props.title}</div>
                </div>
                <div className="numero-element control-panel">
                    <RemoveNumero numKey={this.props.numKey} title={this.props.title}/>
                    <EditNumero numKey={this.props.numKey}/>
                    <ArticlesEdit numKey={this.props.numKey}/>
                </div>
            </div>)
    }
}
class ArticlesEdit extends React.Component{
    constructor(prop){
        super(prop);
    }
    render() {
        return (<Link to={"/admin/numero/articles/" + this.props.numKey} className="article-button container"><i
            className="material-icons article-button">
            library_books
        </i></Link>);
    }
}
class RemoveNumero extends React.Component {
    constructor(prop) {
        super(prop);
    }
    componentDidMount() {
        document.getElementById("remove-"+this.props.numKey).addEventListener("click", this.removeHandle.bind(this));

    }

    componentWillUnmount() {
            document.getElementById("remove-"+this.props.numKey).removeEventListener("click", this.removeHandle.bind(this));

    }
    removeHandle(){
        if(window.confirm('Voulez-vous supprimer ce numero :'+this.props.title)){
            let db = firebase.database();
            db.ref(`/numero/${this.props.numKey}`).remove().then(()=>{
                db.ref(`/numero_titles/${this.props.numKey}`).remove().then(()=>{
                    window.location = '/admin/numero';
                });
            });
        }
    }
    render() {
        return (<div className="remove-button container" id={"remove-"+this.props.numKey}><i className="material-icons remove-button">
            restore_from_trash
        </i></div>);
    }
}

class EditNumero extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Link to={"/admin/numero/edit/" + this.props.numKey} className="edit-button container"><i
            className="material-icons edit-button">
            edit
        </i></Link>);
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
    constructor(prop) {
        super(prop);
        this.state = {
            message: '',
            title: 'loading...',
            coordonnateur: '',
            publish: false,
            ord: null,
            articles: null,
            numKey:this.props.numKey,
        };
    }

    componentDidMount() {
        if (this.props.numState === 'new') {
            document.getElementById('submit-new-numero').addEventListener("click", this.submitHandle.bind(this));
        }
        if (this.props.numState === 'edit') {
            document.getElementById('submit-edit-numero').addEventListener("click", this.editHandle.bind(this));
            firebase.database().ref(`/numero/${this.props.numKey}`).once('value').then((s) => {
                // console.log(s.val());
                this.setState({
                    articles: s.val().articles,
                    coordonnateur: s.val().coordonnateur,
                    publish: s.val().publish,
                    ord: s.val().ord+1,
                    title: s.val().title,
                    publicationDate:s.val().publicationDate,
                });
            });
        }
    }

    componentWillUnmount() {
        if (this.props.numState === 'new') {
            document.getElementById('submit-new-numero').removeEventListener("click", this.submitHandle.bind(this));
        }
        if (this.props.numState === 'edit') {
            document.getElementById('submit-edit-numero').removeEventListener("click", this.editHandle.bind(this));

        }
    }

    submitHandle() {
        if ($('#new-numero-title-ınput').val() === '') {
            this.setState({message: 'Titre est null'});
            return;
        } else {
            this.setState({message: ''});
            let db = firebase.database();
            let data = {
                articles: {},
                title: $('#new-numero-title-ınput').val(),
                publish: $('#new-numero-publish-ınput').is(":checked"),
                coordonnateur: $('#new-numero-coordonnateur-ınput').val(),
                publicationDate:$('new-numero-publication-date-ınput').val(),
                ord: null,
            };
            db.ref('/conf/numCount').once('value').then(s => {
                data.ord = s.val();
                console.log(data);
            }).then(() => {
                    db.ref('/numero').push(data).then(s => {
                        db.ref(`/numero_titles/${s.key}/title`).set(data.title).then(()=>{
                            db.ref(`/numero/${s.key}/publicationDate`).set(data.publicationDate).then(()=>{
                                db.ref(`/numero_titles/${s.key}/publish`).set(data.publish).then(()=>{
                                    db.ref(`/numero_titles/${s.key}/ord`).set(data.ord).then(()=>{
                                        db.ref('/conf/numCount').set(data.ord + 1).then(()=>{
                                            window.location = '/admin/numero';
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
        }
    }

    editHandle() {
        if ($('#new-numero-title-ınput').val() === '') {
            this.setState({message: 'Titre est null'});
            return;
        } else {
            if(this.state.numKey !== undefined){
                this.setState({message: ''});
                let db = firebase.database();
                db.ref(`/numero/${this.state.numKey}/title`).set(this.state.title).then(() => {
                    db.ref(`/numero_titles/${this.state.numKey}/title`).set(this.state.title).then();
                    this.setState({message: 'Title Updated'});
                    db.ref(`/numero/${this.state.numKey}/publicationDate`).set(this.state.publicationDate).then(()=>{
                        db.ref(`/numero/${this.state.numKey}/publish`).set(this.state.publish).then(() => {
                            db.ref(`/numero_titles/${this.state.numKey}/publish`).set(this.state.publish).then();
                            this.setState({message: 'Publish Updated'});
                            db.ref(`/numero/${this.state.numKey}/coordonnateur`).set(this.state.coordonnateur).then(() => {
                                this.setState({message: 'Coordonnateur Updated'});
                                window.location = '/admin/numero';
                            });
                        });
                    });
                });


            }else{
                this.setState({message: 'Numero ID is undefined'});
            }
        }
    }

    changeValueState(state, value) {
        let data = {};
        data[state] = value;
        this.setState(data);
    }

    render() {
        if (this.props.numState === 'new') {
            return (<div className="new-numero-page container">
                <div className="new-numero-page inside">
                    <div className="new-numero-page error">{this.state.message}</div>
                    <div>
                        <strong>Titre:</strong><input type="text" id="new-numero-title-ınput"
                                                      className="new-numero text-input"/></div>
                    <div><strong>Coordonnateur:</strong><input type="text" id="new-numero-coordonnateur-ınput"
                                                               value={this.state.coordonnateur}
                                                               className="new-numero text-input"
                                                               onChange={e => {
                                                                   this.changeValueState('coordonnateur', e.target.value);
                                                               }}/>
                    </div>
                    <div><strong>Date de publication:</strong><input type="text" id="new-numero-publication-date-ınput"
                                                               value={this.state.publicationDate}
                                                               className="new-numero text-input"
                                                               onChange={e => {
                                                                   this.changeValueState('publicationDate', e.target.value);
                                                               }}/>
                    </div>
                    <div><strong>Publish :</strong><input type="checkbox" id="new-numero-publish-ınput"/></div>
                    <div>
                        <button id="submit-new-numero">Submit</button>
                    </div>
                </div>
            </div>);
        }
        if (this.props.numState === 'edit') {
            return (<div className="edit-numero-page container">
                <div className="edit-numero-page inside">
                    <div className="edit-numero-page error">{this.state.message}</div>
                    <div>
                        <strong>Titre:</strong><input type="text" id="edit-numero-title-ınput"
                                                      className="edit-numero text-input" value={this.state.title}
                                                      onChange={e => {
                                                          this.changeValueState('title', e.target.value);
                                                      }}/></div>
                    <div><strong>Coordonnateur:</strong><input type="text" id="edit-numero-coordonnateur-ınput"
                                                               value={this.state.coordonnateur}
                                                               className="edit-numero text-input" onChange={e => {
                        this.changeValueState('coordonnateur', e.target.value);
                    }}/>
                    </div>
                    <div><strong>Date de publication:</strong><input type="text" id="new-numero-publication-date-ınput"
                                                                     value={this.state.publicationDate}
                                                                     className="new-numero text-input"
                                                                     onChange={e => {
                                                                         this.changeValueState('publicationDate', e.target.value);
                                                                     }}/>
                    </div>
                    <div><strong>Publish : </strong><input type="checkbox" id="edit-numero-publish-ınput"
                                                           checked={this.state.publish}
                                                           onClick={e => {
                                                               this.changeValueState('publish', !this.state.publish)
                                                           }}/></div>
                    <div>
                        <button id="submit-edit-numero">Submit</button>
                    </div>
                </div>
            </div>);
        }
        return (<div></div>);
    }
}