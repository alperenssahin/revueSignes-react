import React from 'react';
import './menu.css';
import $ from 'jquery'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import * as firebase from 'firebase';
import {AdminNumeroPane,NumeroDataPage} from './numeroControlPanel.js'
import {ArticleControlPage} from './articleControl.js';
import {NewArticlePage} from './newarticlepage.js';
import {AppelCommunication} from './appelCommunication.js';
import {NewAppel} from './newAppel.js';
import {Presentation} from './presentation.js';
import {NewPrensentation} from "./newPresentation.js";
import {Configuration} from "./configuration.js";
export class Menu extends React.Component {
    constructor(prop) {
        super(prop);
    }

    getNum() {
        return (<AdminNumeroPane/>);
    }
    dataNum({match}){
        return (<NumeroDataPage numState={match.params.id} numKey={match.params.num}/>);
    }
    articleSelected({match}){
        return(<ArticleControlPage numKey={match.params.id}/>);
    }
    newArticle({match}){
        return(<NewArticlePage numKey={match.params.id}/>);
    }
    getApp(){
        return(<AppelCommunication/>)
    }
    getAppNew(){
        return(<NewAppel/>);
    }
    getPre(){
        return(<Presentation/>);
    }
    getPreNew(){
        return(<NewPrensentation/>);
    }
    getConf(){
        return(<Configuration/>);
    }
    render() {
        return (<div className="admin-menu container">
            < div className="admin-menu inside">
                <div className="admin-menu-navigation">
                    <Link className="link-menu" to="/admin/numero">Numéros</Link>
                    <Link className="link-menu" to="/admin/appel">Appel à Communication</Link>
                    <Link className="link-menu" to="/admin/presentation">Présentation</Link>
                    {/*<Link className="link-menu" to="/admin/users">Utilisateurs</Link>*/}
                    <Link className="link-menu" to="/admin/configuration">Configuration</Link>

                </div>
                <hr/>
                <div className="admin-menu content">
                    <Route exact path="/admin/numero" component={this.getNum}/>
                    <Route path="/admin/numero/:id/:num" component={this.dataNum}/>
                    <Route exact path="/admin/numero/:id" component={this.dataNum}/>
                    <Route exact path="/admin/numero/articles/:id" component={this.articleSelected}/>
                    <Route exact path="/admin/numero/articles/new/:id" component={this.newArticle}/>
                    <Route exact path="/admin/appel" component={this.getApp}/>
                    <Route exact path="/admin/appel/new" component={this.getAppNew}/>
                    <Route exact path="/admin/presentation" component={this.getPre}/>
                    <Route exact path="/admin/presentation/new" component={this.getPreNew}/>
                    {/*<Route path="/admin/users" component={this.getUsr}/>*/}
                    <Route exact path="/admin/configuration" component={this.getConf}/>

                </div>
            </div>
        </div>)
    }
}
