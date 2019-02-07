import React from 'react';
import './css/content.css';
import $ from 'jquery'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import axios from 'axios'
import {Config} from "./configurator";
import {Items} from './navContent.js'
import * as firebase from 'firebase/app';
import 'firebase/storage';
import renderHTML from 'react-render-html';


export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: {title: 'Loading..', cordonnateur: 'Loading..', articles: undefined, artIndex: undefined},
            numID: '',
            fireB: false,
        };
        this.defaultNumero = this.defaultNumero.bind(this);
        this.selectedNumero = this.selectedNumero.bind(this);
        this.selectedArticle = this.selectedArticle.bind(this);
        this.connection = this.connection.bind(this);
    }

    defaultNumero() {
        // if (!this.state.fireB) {
        //     const config = {
        //         apiKey: "AIzaSyDfl5mPOlVX4wA1JCrx0qNkpAycXscF390",
        //         authDomain: "revue-si.firebaseapp.com",
        //         storageBucket: "gs://revue-si.appspot.com",
        //     };
        //     firebase.initializeApp(config);
        //     this.setState({fireB: true});
        // }
        // const storage = firebase.storage();
        // const gsReference = storage.refFromURL('gs://revue-si.appspot.com/test.png');
        // gsReference.getDownloadURL().then(function (url) {
        //     return url;
        // }).then((url) => {
        //     this.setState({urlImage: url})
        // });
        // this.setState({urlImage: url});

        return (
            <div>
                <h1>numero title</h1>
                {/*<img src={this.state.urlImage}/>*/}
            </div>
        )
    }


    connection(id) {
        let conf = new Config();
        // console.log(`${conf.server()}/numeroTitle`);
        if (this.state.numID !== id) {
            this.setState({numID: id});
            axios.get(`${conf.server()}/numeroTitle/${id}`).then(
                (r) => {
                    const num = r.data;
                    // console.log(num);
                    this.setState({num});
                }
            );
        }
    }

    selectedNumero({match}) {
        this.connection(match.params.id);
        let numero = [];
        if (this.state.num.articles !== undefined) {
            // console.log(this.state.num.articles);
            for (let x in this.state.num.articles) {
                let base = this.state.num.articles[x];
                let article = [];
                // console.log(base.artIndex);
                if (base.artIndex === undefined) {
                    article.push(<Link className="article content"
                                       to='#undefined'>{base.title}</Link>);
                } else {
                    let key = Object.keys(base.artIndex)[0];
                    article.push(<Link className="article content"
                                       to={'/article/' + base.artIndex[key]}>{base.title}</Link>);
                }
                base.author !==undefined?
                article.push(<p className="author content">{base.author.join(' et ')}</p>):
                    article.push(<p className="author content"></p>);
                article.push(<hr/>);
                numero.push(<div className="articleBox content" style={{order: (base.ord + 1)}}>{article}</div>);

            }
        }
        return (
            <div>
                <h1 className="title content">{this.state.num.title}</h1>
                <h5 className="coordonnateur content">{this.state.num.coordonnateur}</h5>
                <hr/>
                <div className="numeroName content">{numero}</div>
            </div>
        );
    }

    selectedArticle({match}) {
        // console.log(match.params.id);
        return (<div>
            <Article url={match.params.id}/>
        </div>)
    }

    render() {
        //todo:menu kapatma düğmesi eklenecek, sıralama css eklentisi eklenecek
        return (
            <div className="text outside">
                <div className="inside text">
                    <Route exact path='/' component={this.defaultNumero}/>
                    <Route path='/library/:id' component={this.selectedNumero}/>
                    <Route path="/article/:id" component={this.selectedArticle}/>
                </div>
            </div>
        )
    }

}

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            art: {html: '<h1>Loading...</h1>', old: false},
            artID: '',
            fireB: false,
        };
        this.connection = this.connection.bind(this);
    }

    connection() {
        if (!this.state.fireB) {
            this.setState({fireB: true});
        }
    }


        componentDidMount() {
            window.addEventListener("click", this.click.bind(this));
            let conf = new Config();
            // console.log(`${conf.server()}/numeroTitle`);
            axios.get(`${conf.server()}/article/${this.props.url}`).then(
                (r) => {
                    const art = r.data;
                    // console.log(num);
                    this.setState({art});
                }
            ).then(
                ()=>{
                    updateIMG();
                }
            );


        }

        componentWillUnmount() {

            window.removeEventListener("click", this.click.bind(this));

        }

    click(){
        this.setState({artID:this.props.url});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.connection();
        let conf = new Config();
        if (prevState.artID !== this.state.artID) {
            axios.get(`${conf.server()}/article/${this.props.url}`).then(
                (r) => {
                    const art = r.data;
                    // console.log(num);
                    this.setState({art});
                }
            ).then(()=>{
                updateIMG();
            });
        }

    }

    render() {
        // console.log(this.props.url);
        return <div>{renderHTML(this.state.art.html)}</div>
    }
}
function updateIMG(){
    $.each($('img'), (i, v) => {
        const storage = firebase.storage();
        console.log('workk');
        // console.log(v.src);
        if (v.src.split('://')[0] !== 'https') {
            const gsReference = storage.refFromURL(`gs://revue-si.appspot.com/album/${v.id}`);
            gsReference.getDownloadURL().then(function (url) {
                return url;
            }).then((url) => {
                // this.setState({urlImage: url})
                // console.log(url);
                v.src = url;
            });
        }
        // console.log(v);
    });
}