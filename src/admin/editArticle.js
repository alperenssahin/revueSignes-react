import React from 'react';
import * as firebase from 'firebase';
import './editArticle.css'
import '../css/content.css'

export class EditArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value:'',title: '', author: ''};
        // this.props.relatedKey
    }

    componentDidMount() {
        firebase.database().ref(`/articles/${this.props.articleKey}`).once(`value`).then(s => {
            this.setState({value: s.val().html});
            let ht = document.getElementById('edit-preview');
            ht.innerHTML = s.val().html;
            let title = ht.querySelector('h1');
            this.setState({title: title});
            let authors = ht.querySelectorAll('.auteur-info.name');
            let authorarr = [];
            for (let a of authors) {
                authorarr.push(a.textContent);
            }
            this.setState({author: authorarr});
        });

        document.getElementById('edit-article-submit').addEventListener("click", this.submitHandler.bind(this));
        document.getElementById('edit-preview').addEventListener("click", this.editHandler.bind(this));
        document.getElementById('confirm-change-button').addEventListener("click", this.setterHandler.bind(this));


    }

    componentWillUnmount() {
        document.getElementById('edit-article-submit').removeEventListener("click", this.submitHandler.bind(this));
        document.getElementById('edit-preview').removeEventListener("click", this.editHandler.bind(this));
        document.getElementById('confirm-change-button').removeEventListener("click", this.setterHandler.bind(this));

    }

    submitHandler() {
        let ht = document.getElementById('edit-preview');
        this.setState({value:ht.innerHTML});
        let title = ht.querySelector('h1');
        this.setState({title: title.textContent});
        let authors = ht.querySelectorAll('.auteur-info.name');
        let authorarr = [];
        for (let a of authors) {
            authorarr.push(a.textContent);
        }
        this.setState({author: authorarr});
        firebase.database().ref(`/articles/${this.props.articleKey}/html`).set(this.state.value).then(() => {
            firebase.database().ref(`/numero/${this.props.numKey}/articles/${this.props.relatedKey}/title`).set(this.state.title).then(() => {
                firebase.database().ref(`/numero/${this.props.numKey}/articles/${this.props.relatedKey}/author`).set(this.state.author).then(() => {
                    window.location.href = '/admin/numero/articles/' + this.props.numKey;
                });
            });
        });
    }

    editHandler = (e) => {
        let ta = document.querySelector('#piece-area');
        if (e.target === document.querySelector('#edit-preview')) {

        } else {
            let pre_target  =  document.querySelector('#editing-element');
            if(pre_target !== null){
                pre_target.id = '';
            }
            e.target.id = 'editing-element';
            ta.value = e.target.textContent;
        }
    };
    setterHandler = () =>{
        let ta = document.querySelector('#piece-area');
        if(ta.value === ''){
          document.querySelector('#editing-element').outerHTML = '';
        }else{
            document.querySelector('#editing-element').textContent = ta.value;
            document.querySelector('#editing-element').id = '';
        }
    };

    render() {
        return (
            <div>
                <div className={'edit-article container'}>
                    <div className={'edit-article inside'}>
                        <div className={'edit-article text-box-container'}>
                            <button id={'edit-article-submit'}>Mettre à jour</button>
                        </div>
                        <i>*Click on the pieces of text you want to edit*</i>
                        <div className={'edit-piece-container'}>
                            <textarea id={'piece-area'}> </textarea>
                            <button id={'confirm-change-button'}>OK</button>
                        </div>
                        <div className={'edit-article preview-container'} id={'edit-preview'}>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
