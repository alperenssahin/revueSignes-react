import axios from 'axios'
import React from 'react';
export class Config extends React.Component {
    constructor(props){
        super(props);
        this.server = this.server.bind(this);

    }

    server(){
        return 'http://localhost:8001';
    }

}