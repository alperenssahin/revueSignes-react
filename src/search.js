import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import * as firebase from 'firebase/app';
import './css/search.css'
import $ from "jquery";
import axios from 'axios'
import {Config} from "./configurator";

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    close(e) {
        if (e.target.id === "searchContainer" || e.target.className === "resItem" ) {
            $('.out.searchBar').css('display', 'none');
        }
    }

    render() {
        return (<div className="searchBar out abs"><div className="searchBar out" id="searchContainer" onClick={this.close}>
            <div className="searchBar inside">
                <div className="searchBar input"><
                    input className="searchBar" id="searchInput" type="search"
                          placeholder="Rechercher un Article ou un Numéro"/>
                </div>
                <div className="searchBar result outside">
                    <div className="searchBar result in"><h4>Les résultats</h4>
                        <hr/>
                        <Result/>
                    </div>
                </div>
            </div>
        </div></div>);
    }
}

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchInput: '', resultFilter: [{numID: '', artID: ['', '']}], data: {'null': null}};
    }

    componentDidMount() {
        document.getElementById('searchInput').addEventListener("keyup", this.search.bind(this));
        //burada butun metinler indirilecek
        let conf = new Config();
        axios.get(`${conf.server()}/navbar/library`).then(
            (r) => {
                const data = r.data;
                // console.log(title);
                this.setState({data});
            }
        );
    }

    componentWillUnmount() {
        document.getElementById('searchInput').removeEventListener("keyup", this.search.bind(this));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.searchInput !== this.state.searchInput && this.state.searchInput !== '' && this.state.searchInput.length > 2) {
            console.log(this.state.searchInput);
            //find object
            let data = [];
            for (let num in this.state.data) {
                let resObj = {numID: num, artID: []};
                if (num !== 'null') {
                    for (let art in this.state.data[num].articles) {
                        let article = this.state.data[num].articles[art];
                        if (article.title.includes(this.state.searchInput)) {
                            if (article.artIndex !== undefined) {
                                let key = Object.keys(article.artIndex)[0];
                                // console.log(key);
                                let articleOBJ = {textID: article.artIndex[key], art: art};
                                resObj.artID.push(articleOBJ);
                            }
                        }
                    }
                    if (resObj.artID.length > 0) {
                        data.push(resObj);
                    } else {
                        if (this.state.data[num].title.includes(this.state.searchInput)) {
                            data.push(resObj);
                        }
                    }
                }
            }
            this.setState({resultFilter: data});
        }
    }

    search() {
        let s = $('#searchInput');
        this.setState({searchInput: s.val()});
        if (s.val().length !== 0) {
            let s =$('.searchBar.result.outside');
            s.css('display', 'block');
        } else {
            $('.searchBar.result.outside').css('display', 'none');
        }

    }

    render() {
        let resItem = [];
        for (let num of this.state.resultFilter) {
            resItem.push(<ResItem num={num.numID} art={num.artID} data={this.state.data}/>);
        }
        return <div>{resItem}</div>;
    }
}

class ResItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.data.null === undefined) {
            // console.log(this.props.data);
            // console.log(this.props.num);
            let article = [];
            let tit = '';
            for (let x of this.props.art) {
                if(this.props.data[this.props.num] !== undefined) {
                    article.push(<Link to={'/article/'+x.textID}>
                        < div className="resItem"> {this.props.data[this.props.num].articles[x.art].title}
                        </div><br/>
                    </Link>);

                tit = this.props.data[this.props.num].title;
                }
            }
            return (
                <div>
                    <Link to={'/library/'+this.props.num}>
                    <h4 className="resItem">{tit}</h4>
                    </Link>
                    <h5 >{article}</h5>
                    <hr/>
                </div>
            )
        } else {
            return <div></div>
        }
    }
}