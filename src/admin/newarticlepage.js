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
        this.state = {
            arrayAuthor: [<Author count={1}/>],
            title: "", errorMessage: "", fireIndex: "",
            processe:0,
        };
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

    async sendHandler() {
        let data = {
            author: [],
            title: this.state.title,
            ord: "",
            artIndex: {},
        }
        $.each($('.auteur-info.name'), (i, v) => {
            data.author.push(v.textContent);
        });
        firebase.database().ref(`/numero/${this.props.numKey}/articles`).once('value').then(s => {
            let count = 0;
            if (s.val() !== null) {
                for (let a in s.val()) {
                    count++;
                }
            }
            data.ord = count;
        });
        Promise.all(this.uploadImage()).then(() => {
            this.setState({processe:75});
            this.uploadHtmlFile().then(() => {
                data.artIndex['key'] = this.state.fireIndex;
                this.setState({processe:95});
                firebase.database().ref(`/numero/${this.props.numKey}/articles`).push(data).then(() => {
                    this.setState({processe:100});
                    firebase.database().ref('/index/author').remove().then(()=>{
                        firebase.database().ref('/numero').once('value').then(s=>{
                            let data = s.val();
                            let obj = {};
                            for(let key in data){
                                let adata = data[key].articles;
                                for(let akey in adata){
                                    let author = adata[akey].author;
                                    try{
                                        for(let aut of author){
                                            aut = aut.toLowerCase();
                                            if(obj[aut] === undefined){
                                                obj[aut] = [{key:akey,num:key}];
                                            }else{
                                                obj[aut].push({key:akey,num:key});
                                            }
                                        }
                                    }catch (e) {

                                    }
                                }
                            }
                            for(let at in obj){
                                firebase.database().ref('/index/author/').push({name:at,data:obj[at]});
                                window.location = '/admin/numero/articles/' + this.props.numKey;
                            }
                        });
                    });
                });
            });
        });


    }

    removeAuthor() {
        let tmp = this.state.arrayAuthor;
        tmp.pop();
        this.setState({arrayAuthor: tmp});
    }

    addAuthor() {
        let getCount = this.state.arrayAuthor.length + 1;
        let tmp = this.state.arrayAuthor;
        tmp.push(<Author count={getCount}/>);
        this.setState({arrayAuthor: tmp});
    }

    render() {

        let authorBox = [];
        let count = 1;
        for (let a of this.state.arrayAuthor) {
            authorBox.push(<h4 className={"auteur-info name counter-" + count}></h4>);
            authorBox.push(<h5 className={"auteur-info title counter-" + count}></h5>);
            authorBox.push(<h5 className={"auteur-info mail counter-" + count}></h5>);
            authorBox.push(<h5 className={"auteur-info universite counter-" + count}></h5>);
            count++;
        }

        return (<div className="new-article-page container">
            <div className={"new-article-page dialog-form"} style={{width: '100%'}}>
                <div className={"proocesse-Bar"}
                     style={{width: this.state.processe + '%'}}> %{this.state.processe}
                </div>
            </div>
            <div className="new-article-page inside">
                <div className="new-article-page form out">
                    <div className={"error-box"}>{this.state.errorMessage}</div>
                    <div className="new-article-page form row">
                        <strong>Titre : </strong>
                        <input type="text" className={"form"}
                               value={this.state.title}
                               onChange={e => {
                                   this.changeValueState('title', e.target.value);
                               }}/>
                    </div>
                    <hr/>
                    <div className="author-control-pane">
                        Auteur :
                        <div id="add-author" className="author-control-pane button"><i className="material-icons">
                            person_add
                        </i></div>
                        |
                        <div id="remove-author" className="author-control-pane button"><i className="material-icons">
                            person_add_disabled
                        </i></div>
                    </div>
                    <div className="new-article-page form row author">
                        {this.state.arrayAuthor}
                    </div>
                    <hr/>
                    <input type={"file"}
                           className={"input-file"}
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
                    <button id={"send-article"}>Mettre à Jour</button>
                </div>
                <div className="new-article-page preview">
                    <h1>{this.state.title}</h1>
                    {authorBox}
                    <hr/>
                    <div className="new-article-file"></div>
                </div>
            </div>
        </div>);
    }

    changeValueState(state, value) {
        let data = {};
        data[state] = value;
        this.setState(data);
    }

    async uploadHtmlFile() {
        let string = await $('.new-article-page.preview').html();
        console.log(string);
        await firebase.database().ref('/articles').push({html: string}).then((s) => {
            console.log("dosya yüklendi");
            this.setState({fireIndex: s.key});
        });
    }

    uploadImage() {
        let promises = [];
        let img = $('.new-article-page.preview img');
        let perIm = 50/img.length;
            for (let v  of img) {
                let storage = firebase.storage();
                let storageRef = storage.ref();
                let imageType = v.src.split(';')[0].split(':')[1].split('/')[1];
                let uniqueID = uuidv1();
                let imageName = uniqueID + '.' + imageType;
                let imagesRef = storageRef.child('album/' + imageName);
                let message = v.src;
                v.id = imageName;
                v.src = "";
                let s = this.state.processe+perIm;
                this.setState({processe:s});
                promises.push(new Promise(resolve => {
                    imagesRef.putString(message, 'data_url').then(function (snapshot) {
                        //ilerleme çubuğu koy
                        //bu kısmı kayıt esnasında yürüt
                        resolve();
                    });
                }));
            }
            return promises;
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
        this.state = {name: "", email: "", universite: "", title: ""};
    }

    render() {

        return (<div className="author-box">
                <hr/>

                <div>
                    <strong className={"author-count"}>
                    {this.props.count}. Auteur
                    </strong>
                </div>
                <div>
                    <strong>Nom : </strong>
                    <input type="text"
                           className={"form"}
                           value={this.state.name}
                           onChange={e => {
                               this.setState({name: e.target.value});
                               $('.auteur-info.name.counter-' + this.props.count).text(e.target.value);
                           }}
                    />
                </div>
                <div>
                    <strong>Titre : </strong>
                    <input type="text" value={this.state.title}
                           className={"form"}

                           onChange={e => {
                               this.setState({title: e.target.value});
                               $('.auteur-info.title.counter-' + this.props.count).text(e.target.value);

                           }}/>
                </div>
                <div>
                    <strong>Adresse mail : </strong>
                    <input type="text" value={this.state.email}
                           className={"form"}

                           onChange={e => {
                               this.setState({email: e.target.value});
                               $('.auteur-info.mail.counter-' + this.props.count).text(e.target.value);

                           }}/>
                </div>
                <div>
                    <strong>Université : </strong>
                    <input type="text" value={this.state.universite}
                           className={"form"}

                           onChange={e => {
                               this.setState({universite: e.target.value});
                               $('.auteur-info.universite.counter-' + this.props.count).text(e.target.value);

                           }}/>
                </div>
            </div>
        );
    }

}
