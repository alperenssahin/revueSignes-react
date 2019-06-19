import React from 'react';
import './admin.css';
import $ from 'jquery';
import {Menu} from './menu.js';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import * as firebase from 'firebase';

export class Admin extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            authentication: false, user: null,
            identifier: <div>Control Panel</div>,
            displaySignIn: {display: 'block'},
            displaySignOut: {display: 'none'},
            role:{'10':'Admin','5':'Moderator','1':'User','0':'Guest'},
            userRole:'Guest',
            controlPanel:<div>Please sign in for access to options</div>,
        };
        this.userCheck = this.userCheck.bind(this);
    }

    componentDidMount() {

        this.heightUpdater();
        this.userCheck();
        if(this.state.authentication){
            this.signIn();
        }
        document.getElementById('signIn').addEventListener("click", this.signIn.bind(this));
        document.getElementById('signOut').addEventListener("click", this.signOut.bind(this));
        document.getElementById('close-admin-pane').addEventListener("click", this.close.bind(this));


    }

    componentWillUnmount() {
        document.getElementById('signIn').removeEventListener("click", this.signIn.bind(this));
        document.getElementById('signOut').removeEventListener("click", this.signOut.bind(this));
        document.getElementById('close-admin-pane').removeEventListener("click", this.close.bind(this));


    }
    close(){
        window.location = '/';
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.user !== this.state.user) {
            if (this.state.user !== null) {
                let id = <UserCart name={this.state.user.displayName} uid={this.state.user.uid}
                                   email={this.state.user.email}/>;
                this.setState({identifier: id, displaySignIn: {display: 'none'}, displaySignOut: {display:'block'}});
            } else {
                this.setState({identifier: <div><strong>Control Panel</strong></div>, displaySignIn: {display: 'block'}, displaySignOut: {display:'none'}});
            }
        }
        if(prevState.userRole !== this.state.userRole) {
            if(this.state.userRole === 'Admin'){
                let menu = <Menu/>;
                this.setState({controlPanel:menu});
                $('.container.admin').css('width','85%');
            }else{
                this.setState({controlPanel:<div>permission denied</div>});
                $('.container.admin').css('width','40%');

            }
        }
    }

    render() {
        return (<div className="outside admin">
            <div className="container admin">
                <Link to={"/"} id="close-admin-pane" className={"close-admin-pane"}><i className="material-icons">
                    close
                </i></Link>
                <div className="inside admin">

                    <div className="top admin">
                        <div className="top-left">
                            {this.state.identifier}
                        </div>
                        <div className="top-right">
                            <button id="signIn" style={this.state.displaySignIn}>Sign In</button>
                            <button id="signOut" style={this.state.displaySignOut}>Sign Out</button>
                        </div>
                    </div>
                    <hr/>
                    <div className= "admin bottom">
                        {this.state.controlPanel}
                </div>
                </div>
            </div>
        </div>);
    }

    heightUpdater() {
        $('body').css('overflow', 'hidden');
    }

    signIn() {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function () {
                var provider = new firebase.auth.GoogleAuthProvider();
                // In memory persistence will be applied to the signed in Google user
                // even though the persistence was set to 'none' and a page redirect
                // occurred.
                return firebase.auth().signInWithPopup(provider).then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    // let token = result.credential.accessToken;
                    // The signed-in user info.
                    return result.user;

                    // ...
                }).catch(function (error) {
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
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
            }).then(user => {
            console.log(user);
            if(user !== undefined){
                this.permissionHandle(user);
                this.setState({user: user});
                this.setState({authentication: true});
            }
        });


    }

    signOut() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            // console.log('çıkış yapıyorum');
        }).catch(function (error) {
            // An message happened.
        }).then(() => {
            this.setState({user: null});
            this.setState({authentication: false});
            this.setState({userRole:this.state.role['0']});

        });
        sessionStorage.removeItem('uid'); // user is undefined if no user signed in
        sessionStorage.removeItem('displayName');
        sessionStorage.removeItem('email');
    }
    permissionHandle(user){
        firebase.database().ref(`/users/${user.uid}/userRole`).once('value').then((s)=>{
            console.log(s.val());
            if(s.val() === 10){
                this.setState({userRole:this.state.role[s.val()]});
            }else{
                this.setState({userRole:this.state.role['0']});
            }
        });
    }
    userCheck() {

        firebase.auth().onAuthStateChanged((user ) => {
            sessionStorage.setItem('uid',user.uid); // user is undefined if no user signed in
            sessionStorage.setItem('displayName',user.displayName);
            sessionStorage.setItem('email',user.email);
        });
        let user = {
            uid:sessionStorage.getItem('uid'),
            displayName:sessionStorage.getItem('displayName'),
            email:sessionStorage.getItem('email'),
        };
            if (user.uid !== null) {
                // User is signed in.
                console.log(user);
                this.setState({user: user});
                this.setState({authentication: true});
                this.permissionHandle(user);
            } else {
                // No user is signed in.
                console.log('no user');
                this.setState({user: null});
                this.setState({authentication: false});
            }

    }
}

class UserCart extends React.Component {
    constructor(prop) {
        super(prop);
    }

    render() {
        return (<div className="usercart container">
            <div className="usercart inside">
                    <div><strong>Nom: </strong>{this.props.name}</div>
                    <div><strong>E-mail: </strong>{this.props.email}</div>
            </div>
        </div>);
    }
}