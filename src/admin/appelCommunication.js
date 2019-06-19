import React from 'react';
import $ from 'jquery'
import * as firebase from 'firebase';
import './appelCommunication.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

export class AppelCommunication extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(<div className={"appel container"}><
            div className={"appel inside"}>
            <div className={"new-appel-box"}><strong>Créer un nouveau article</strong>
            <Link to={"/admin/appel/new"} id={"appel-add"}>
                <i className="material-icons">
                    note_add
                </i>
            </Link></div>
            <hr/>
            <ArticleList/>
        </div></div>);
    }
}
class ArticleList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {articles:{}};
    }
    componentDidMount() {
        firebase.database().ref('/appel').once("value").then(s=>{
           this.setState({articles:s.val()});
        });
    }

    render() {
        let article = [];
        for(let key in this.state.articles){
            article.push(<ArticleItem title={this.state.articles[key].title}
            appelKey ={key}
            indexKey ={this.state.articles[key].index}
            />);
        }
        return(<div>{article}</div>);
    }
}

class ArticleItem extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return(<div className={"appel-item-out"}>
            <div className={"appel-item-inside"}>
                <div className={"appel-item-title"}>{this.props.title}</div>
                <div className={"control-pane"}>
                    <RemoveArticle appelKey ={this.props.appelKey}
                    title={this.props.title}
                    />
                </div>
            </div>
            <hr/>
        </div>);
    }
}

class RemoveArticle extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.getElementById("remove-appel"+this.props.appelKey).addEventListener("click", this.removeHandle.bind(this));

    }

    componentWillUnmount() {
        document.getElementById("remove-appel"+this.props.appelKey).removeEventListener("click", this.removeHandle.bind(this));

    }
    removeHandle(){
        if(window.confirm('Voulez-vous supprimer cet article :'+this.props.title)){
            let db = firebase.database();
            db.ref(`/appel/${this.props.appelKey}`).remove().then(()=>{
                window.location = '/admin/appel';
            });
        }
    }
    render() {
        return(<div className={"remove-appel"} id={"remove-appel"+this.props.appelKey}>
            <i className="material-icons remove-appel-button ">
                restore_from_trash
            </i>
        </div>);
    }
}