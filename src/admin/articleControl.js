import React from 'react';
import $ from 'jquery'
import * as firebase from 'firebase';
import './article.css'
import {Link} from "react-router-dom";

export class ArticleControlPage extends React.Component {
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
                    inside.push(<ArticleElement articleKey={key} title={base.title} data={base}
                                                numKey={this.props.numKey}/>);
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


class ArticleElement extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.getElementById(this.props.articleKey + "-up").addEventListener('click', this.editUpClick.bind(this));
        document.getElementById(this.props.articleKey + "-down").addEventListener('click', this.editDownClick.bind(this));

    }

    editUpClick(e) {
        let nodes = document.querySelectorAll('.article-element.container');
        let currentNode = document.querySelector('#' + e.target.id.split('-up')[0] + ".container");
        // console.log(currentNode);
        let preNode = null;
        if (currentNode.style.order !== '1') {
            for (let node of nodes) {
                if (Number(node.style.order) === currentNode.style.order - 1) {
                    preNode = node;
                    break;
                }
            }
        } else {
            alert('First element!!');
            return;
        }
        let preOrder = preNode.style.order;
        let currentOrder = currentNode.style.order;
        let tmpOrder = preOrder;
        preNode.style.order = currentOrder;
        currentNode.style.order = tmpOrder;
        firebase.database().ref(`/numero/${this.props.numKey}/articles/${currentNode.id}/ord`).set(preOrder).then(() => {
            firebase.database().ref(`/numero/${this.props.numKey}/articles/${preNode.id}/ord`).set(currentOrder).then(() => {
            });
        });
    };

    editDownClick(e) {
        let nodes = document.querySelectorAll('.article-element.container');
        let currentNode = document.querySelector('#' + e.target.id.split('-down')[0] + ".container");
        // console.log(currentNode);
        let postNode = null;
        if (Number(currentNode.style.order) !== nodes.length) {
            for (let node of nodes) {
                if (Number(node.style.order) === Number(currentNode.style.order) + 1) {
                    postNode = node;
                    break;
                }
            }
        } else {
            alert('Last element!!');
            return;
        }
        let postOrder = postNode.style.order;
        let currentOrder = currentNode.style.order;
        let tmpOrder = postOrder;
        postNode.style.order = currentOrder;
        currentNode.style.order = tmpOrder;
        firebase.database().ref(`/numero/${this.props.numKey}/articles/${currentNode.id}/ord`).set(postOrder).then(() => {
            firebase.database().ref(`/numero/${this.props.numKey}/articles/${postNode.id}/ord`).set(currentOrder).then(() => {
            });
        });
    };

    render() {
        return (
            <div className="article-element container" id={this.props.articleKey}
                 style={{order: (this.props.data.ord)}}>
                <div className={'article-element left-side'}>
                    <div className={'article-element order-controller'} id={this.props.articleKey + '-order'}>
                        <div className={'order-controller-up'}>
                            <i className="material-icons" id={this.props.articleKey + "-up"}>
                                arrow_drop_up
                            </i>
                        </div>
                        <div className={'order-controller-down'}>
                            <i className="material-icons" id={this.props.articleKey + "-down"}>
                                arrow_drop_down
                            </i>
                        </div>
                    </div>
                    <div className="article-element title">{this.props.title}</div>
                </div>
                <div className="article-element control-panel">
                    <RemoveArticle articleKey={this.props.articleKey} numKey={this.props.numKey}
                                   title={this.props.title}/>
                </div>
            </div>)
    }
}

class NewArticle extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <Link to={"/admin/numero/articles/new/" + this.props.numKey} className="admin-article new-article icon"><i
                className="material-icons new-article-button">
                note_add
            </i></Link>);
    }

}

class RemoveArticle extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.getElementById("remove-article" + this.props.articleKey).addEventListener("click", this.removeHandle.bind(this));

    }

    componentWillUnmount() {
        document.getElementById("remove-article" + this.props.articleKey).removeEventListener("click", this.removeHandle.bind(this));

    }

    removeHandle() {
        if (window.confirm('Voulez-vous supprimer ce article : ' + this.props.title)) {
            let db = firebase.database();
            db.ref(`/numero/${this.props.numKey}/articles/${this.props.articleKey}/artIndex`).once(`value`).then(s => {
                let articleKey = s.val()['key'];
                db.ref(`/articles/${articleKey}`).remove().then(() => {
                    db.ref(`/numero/${this.props.numKey}/articles/${this.props.articleKey}`).remove().then(() => {
                        window.location = '/admin/numero/articles/' + this.props.numKey;
                    });
                });
            });

        }
    }

    render() {
        return (<div className="remove-article-button container" id={"remove-article" + this.props.articleKey}><i
            className="material-icons remove-article-button ">
            restore_from_trash
        </i></div>);
    }

}

