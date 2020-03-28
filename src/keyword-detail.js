import React from 'react';
import * as firebase from 'firebase';
import {Link} from "react-router-dom";

export class KeywordDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state ={name:'',articleList:[]}
    }
    componentDidMount() {
        firebase.database().ref("/index/keyword/"+this.props.keywordKey).once('value').then(s=>{
            let ss = s.val();
            let name = ss.name.split(' ');
            let str = '';
            for(let n of name){
                str += n.charAt(0).toUpperCase()+n.slice(1)+ ' ';
            }
            this.setState({name:str});
            for(let dat of ss.data){
                firebase.database().ref(`/numero/${dat.num}/articles/${dat.key}`).once('value').then(a=>{
                    let arr = this.state.articleList;
                    arr.push(<div><Link to={`/article/${Object.values(a.val().artIndex)[0]}`}>{a.val().title}</Link><br/></div>);
                    this.setState({articleList:arr});
                });
            }
        });
    }

    render() {
        return(<div className={'author-detail container'}>
            <div className={'author-detail inside'}>
                <h1>{this.state.name}</h1>
                <div>{this.state.articleList}</div>
            </div>
        </div>);
    }

}