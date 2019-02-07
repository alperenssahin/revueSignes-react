export class Config  {
    constructor(){
        this.server = this.server.bind(this);
    }
    server(){
        return 'http://192.168.1.25:8000'
    }
}