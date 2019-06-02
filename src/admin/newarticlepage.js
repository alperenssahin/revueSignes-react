import React from 'react';
import $ from 'jquery'
import * as firebase from 'firebase';
import {convertToHtml} from 'mammoth';
import './newArticlePage.css'
import '../css/content.css'
import uuidv1 from 'uuid/v1.js';

export class NewArticlePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {arrayAuthor:[<Author count={1}/>],title:"",errorMessage:"",fireIndex:""};
    }
    componentDidMount() {
        document.getElementById('add-author').addEventListener("click", this.addAuthor.bind(this));
        document.getElementById('send-article').addEventListener("click", this.sendHandler.bind(this));
        document.getElementById('remove-author').addEventListener("click", this.removeAuthor.bind(this));

    }

    componentWillUnmount() {
        document.getElementById('add-author').removeEventListener("click", this.addAuthor.bind(this));
        document.getElementById('remove-author').removeEventListener("click", this.removeAuthor.bind(this));
        document.getElementById('send-article').removeEventListener("click", this.sendHandler.bind(this));


    }
    sendHandler(){
        let data = {
            author:[],
            title:this.state.title,
            ord:"",
            artIndex:{},
        }
        $.each($('.auteur-info.name'),(i,v)=>{
            data.author.push(v.textContent);
        });
        firebase.database().ref(`/numero/${this.props.numKey}/articles`).once('value').then(s=>{
           let count = 0;
           if(s.val() !== null){
               for(let a in s.val()){
                   count++;
               }
           }
            data.ord = count;
        });
        this.uploadImage().then(()=>{
            this.uploadHtmlFile().then(()=>{
                data.artIndex['key'] = this.state.fireIndex;
                firebase.database().ref(`/numero/${this.props.numKey}/articles`).push(data);
            });
        });


    }
    removeAuthor(){
        let tmp = this.state.arrayAuthor;
        tmp.pop();
        this.setState({arrayAuthor:tmp});
    }
    addAuthor(){
        let getCount = this.state.arrayAuthor.length+1;
        let tmp = this.state.arrayAuthor;
        tmp.push(<Author count={getCount}/>);
        this.setState({arrayAuthor:tmp});
    }
    render() {

        let authorBox = [];
        let count = 1;
        for(let a of this.state.arrayAuthor){
            authorBox.push(<h4 className={"auteur-info name counter-"+count} > </h4>);
            authorBox.push(<h5 className={"auteur-info title counter-"+count} > </h5>);
            authorBox.push(<h5 className={"auteur-info mail counter-"+count} > </h5>);
            authorBox.push(<h5 className={"auteur-info universite counter-"+count} > </h5>);
            count++;
        }

        return (<div className="new-article-page container">
            <div className="new-article-page inside">
                <div className="new-article-page form">
                    <div className={"error-box"}>{this.state.errorMessage}</div>
                    <div className="new-article-page form row">
                        <strong>Titre : </strong>
                        <input type="text"
                               value={this.state.title}
                               onChange={e=>{
                                   this.changeValueState('title', e.target.value);
                               }}/>
                    </div>
                    <div className="author-control-pane">
                    <div id="add-author" className="author-control-pane button"><i className="material-icons">
                        person_add
                    </i></div>
                    <div id="remove-author" className="author-control-pane button"><i className="material-icons">
                        person_add_disabled
                    </i></div>
                    </div>
                    <div className="new-article-page form row author">
                        {this.state.arrayAuthor}
                    </div>
                    <input type={"file"}
                           onChange={(e) => {
                        this.newArticleUploadHandle(e, (arrayBuffer) => {
                            convertToHtml({arrayBuffer: arrayBuffer}).then((res) => {
                                // console.log(res.value);
                                $('.new-article-file').html(res.value);
                            }).then(() => {
                                //todo:fotoğraf düzenleme seçenekleri eklenecek
                            });
                        });
                    }}/>
                    <button id={"send-article"}>Mettre en Jour</button>
                </div>
                <div className="new-article-page preview">
                    <h1>{this.state.title}</h1>
                    {authorBox}
                    <hr/>
                    <div className="new-article-file"> </div>
                </div>
            </div>
        </div>);
    }
    changeValueState(state, value) {
        let data = {};
        data[state] = value;
        this.setState(data);
    }
    async uploadHtmlFile(){
        let string = $('.new-article-page.preview').html();
        await firebase.database().ref('/articles').push({html:string}).then((s)=>{
            this.setState({fireIndex:s.key});
        });
    }
    async uploadImage() {
       await $.each($('.new-article-file img'), (i, v) => {
            let storage = firebase.storage();
            let storageRef = storage.ref();
            let imageType = v.src.split(';')[0].split(':')[1].split('/')[1];
            let uniqueID = uuidv1();
            let imageName = uniqueID + '.' + imageType;
            let imagesRef = storageRef.child('album/' + imageName);
            let message = v.src;
            imagesRef.putString(message, 'data_url').then(function (snapshot) {
                v.id = imageName;
                v.src = "";
                //ilerleme çubuğu koy
                //bu kısmı kayıt esnasında yürüt 
            });
        });
    }


    newArticleUploadHandle(e, callback) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (loadEvent) => {
            let arrayBuffer = loadEvent.target.result;
            callback(arrayBuffer);
        }
        reader.readAsArrayBuffer(file);
    }
}

class Author extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name:"",email:"",universite:"",title:""};
    }

    render() {

        return (<div className="author-box">
                <div>
                    {this.props.count}. Auteur
                </div>
                <div>
                    <strong>Nom : </strong>
                    <input type="text"
                           value={this.state.name}
                    onChange={e=>{
                        this.setState({name:e.target.value});
                        $('.auteur-info.name.counter-'+this.props.count).text(e.target.value);
                    }}
                    />
                </div>
                <div>
                    <strong>Titre : </strong>
                    <input type="text" value={this.state.title}
                           onChange={e=>{
                               this.setState({title:e.target.value});
                               $('.auteur-info.title.counter-'+this.props.count).text(e.target.value);

                           }}/>
                </div>
                <div>
                    <strong>Adresse mail : </strong>
                    <input type="text" value={this.state.email}
                           onChange={e=>{
                               this.setState({email:e.target.value});
                               $('.auteur-info.mail.counter-'+this.props.count).text(e.target.value);

                           }}/>
                </div>
                <div>
                    <strong>Université : </strong>
                    <input type="text" value={this.state.universite}
                           onChange={e=>{
                               this.setState({universite:e.target.value});
                               $('.auteur-info.universite.counter-'+this.props.count).text(e.target.value);

                           }}/>
                </div>
            </div>
        );
    }

}