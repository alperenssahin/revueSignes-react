import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
// import axios from 'axios'
function Boostrapp(){
    return(
        <div className="jumbotron text-center">
            <h1>My First Bootstrap Page</h1>
            <p>Resize this responsive page to see the effect!</p>
        </div>
    )
}
ReactDOM.render(
<Boostrapp/>,
    document.getElementById('root')
);
