import React from 'react';
import $ from 'jquery'
import * as firebase from 'firebase';
import './article.css'
import {Link} from "react-router-dom";

export class ArticleControlPage extends React.Component{
    constructor(prop) {
        super(prop);
        this.state = {
            articleState: false,
            articles: null,
        };
    }

    componentDidMount() {
        firebase.database().ref(`/numero/${this.props.numKey}/articles`).once('value').then(s => {
            this.setState({articleState: true, articles: s.val()});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.articleState !== this.state.articleState) {
            let inside = [];
            if (this.state.articleState) {
                console.log(this.state.articles);
                for (let key in this.state.articles) {
                    let base = this.state.articles[key];
                    inside.push(<ArticleElement articleKey={key} title={base.title} data={base} numKey={this.props.numKey}/>);
                }
            } else {
                inside = 'Loading...';
            }
            this.setState({elements: inside});
        }
    }

    render() {

        return (<div>
            <div className="admin-article new-article container">
                <div className="admin-article new-article title">Créer un nouveau article</div>
                <NewArticle numKey={this.props.numKey}/>
            </div>
            <hr/>
            <div className="admin-article container">
                <div className="admin-article inside">{this.state.elements}</div>
            </div>
        </div>)
    }
}


class ArticleElement extends React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="article-element container" id={this.props.articleKey}
                 style={{order: (999 - this.props.data.ord)}}>
                <div className="article-element title">{this.props.title}</div>
                <div className="article-element control-panel">
                    <RemoveArticle articleKey={this.props.articleKey} numKey={this.props.numKey} title={this.props.title}/>
                </div>
            </div>)
    }
}

class NewArticle extends React.Component
{
    constructor(props) {
        super(props);

    }

    render() {

        return (<Link to={"/admin/numero/articles/new/"+this.props.numKey} className="admin-article new-article icon"><i
            className="material-icons new-article-button">
            note_add
        </i></Link>);
    }

}
class RemoveArticle extends React.Component
{
    constructor(props) {
        super(props);
        console.log(this.props.articleKey);
    }

    componentDidMount() {
        document.getElementById("remove-article"+this.props.articleKey).addEventListener("click", this.removeHandle.bind(this));

    }

    componentWillUnmount() {
        document.getElementById("remove-article"+this.props.articleKey).removeEventListener("click", this.removeHandle.bind(this));

    }
    removeHandle(){
        if(window.confirm('Voulez-vous supprimer ce numero :'+this.props.title)){
            let db = firebase.database();
            db.ref(`/numero/${this.props.numKey}/articles/${this.props.articleKey}`).remove().then(()=>{
                window.location = '/admin/numero/articles/'+this.props.articleKey;
            });
        }
    }
    render() {
        return (<div className="remove-article-button container" id={"remove-article"+this.props.articleKey}><i className="material-icons remove-article-button ">
            restore_from_trash
        </i></div>);
    }

}

