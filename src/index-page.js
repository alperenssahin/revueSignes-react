import React from 'react';
import * as firebase from 'firebase';
import {Link} from "react-router-dom";


export class IndexPage extends React.Component{

    constructor(props) {
        super(props);
        this.state ={data:{}}
    }

    componentDidMount() {
        this.downloadData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.type !== prevProps.type){
            this.downloadData();
        }
    }

    downloadData(){
        if(this.props.type === 'author'){
            console.log("author");
            firebase.database().ref('/index/author').once('value').then(s=>{
                let data = s.val();
                let obj =[];
                for(let a in data){
                    let c = data[a].name.charAt(0).toUpperCase();
                    if(obj[c] === undefined){
                        obj[c] = [{key:a,name:data[a].name}];
                    }else{
                        obj[c].push({key:a,name:data[a].name});
                    }
                }
                this.setState({data:obj});
            });
        }
        if(this.props.type === 'keyword'){
            console.log("keyword");
            firebase.database().ref('/index/keyword').once('value').then(s=>{
                let data = s.val();
                let obj =[];
                for(let a in data){
                    let c = data[a].name.charAt(0).toUpperCase();
                    if(obj[c] === undefined){
                        obj[c] = [{key:a,name:data[a].name}];
                    }else{
                        obj[c].push({key:a,name:data[a].name});
                    }
                }
                this.setState({data:obj});
            });
        }
    }
    render() {
        let title = 'Loading...';
        let content = [];
        if(this.props.type === 'author'){
            title = 'Auteur';
        }
        if(this.props.type === 'keyword'){
            title = 'Mot Clés';
        }
        let keys = Object.keys(this.state.data).sort();
        for(let k of keys){
            content.push(<h3>{k}</h3>);
            for(let data of this.state.data[k]){
                content.push(<Item name={data.name} authorKey={data.key} type={this.props.type}/>);
            }
        }
        return(<div className={'index-page container'}>
            <h1>{title}</h1>
            <hr/>
            <div className={'index-page content'}>
                {content}
            </div>
        </div>);
    }

}
class Item extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        let name = this.props.name;
        let str = '';
        for(let word of name.split(' ')){
            str += word.charAt(0).toUpperCase() +word.slice(1)+ ' ';
        }
        name = str;
        return(<div className={'index-item container'}>
            <div className={'index-item inside'}>
                <Link to={`/${this.props.type}/${this.props.authorKey}`}>{name}</Link>
            </div>
        </div>);
    }

}