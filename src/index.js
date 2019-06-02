import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import {Header} from './header';
import {Navbar} from './navbar';
import {Content} from './content';
import {Footer} from './footer';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Admin} from './admin/admin.js';

import * as firebase from 'firebase';
// import * as firebase from 'firebase/database';
import {Search} from './search.js'
const config = {
    apiKey: "AIzaSyDfl5mPOlVX4wA1JCrx0qNkpAycXscF390",
    authDomain: "revue-si.firebaseapp.com",
    databaseURL: "https://revue-si.firebaseio.com/",
    storageBucket: "gs://revue-si.appspot.com",
};
firebase.initializeApp(config);


class Base extends React.Component {

    render() {
        return (
            <Router>
                <div style={{width: '100%'}}>
                    <Route path='/admin' component={adminPage}/>
                    <Search/>
                    <Route strict path='/' component={mainPage}/>
                </div>
            </Router>
        )
    }
}
function adminPage() {
    return <Admin/>;
}

function mainPage({match}) {
    return (
        <div id="container" className="boddy">
            <Navbar/>
            <div className="content contr">
                <Header base="/"/>
                <Content url={match.url}/>
                <hr/>
                <Footer/>
            </div>
        </div>
    )
}

ReactDOM.render(
    <Base/>,
    document.getElementById('root')
);
