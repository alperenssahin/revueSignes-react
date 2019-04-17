import React from 'react';
import './admin.css';
import $ from 'jquery'

import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import * as firebase from 'firebase';

export class Admin extends React.Component {
    constructor(prop) {
        super(prop);

    }

    componentDidMount() {

        this.heightUpdater();
        document.getElementById('signIn').addEventListener("click", this.signIn.bind(this));
        document.getElementById('signOut').addEventListener("click", this.signOut.bind(this));


    }

    componentWillUnmount() {
        document.getElementById('signIn').removeEventListener("click", this.signIn.bind(this));
        document.getElementById('signOut').removeEventListener("click", this.signOut.bind(this));


    }


    render() {
        return (<div className="outside admin">
            <div className="container admin">
                <div className="inside admin">
                    <button id="signOut">sign out</button>
                    <button id="signIn">sign in</button>
                </div>
            </div>
        </div>);
    }

    heightUpdater() {
        $('body').css('overflow', 'hidden');
    }
    signIn(){
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            console.log(user);
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorMessage);
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            // ...
        });
    }
    signOut(){
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('çıkış yapıyorum');
        }).catch(function(error) {
            // An error happened.
        });
    }
}

