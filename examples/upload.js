import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios'
 class Uploader extends React.Component{
     constructor(props) {
         super(props);
         this.state = { selectedFile: null, loaded: 0, };
         this.handleSubmit = this.handleSubmit.bind(this);
         this.handleSelectedFile = this.handleSelectedFile.bind(this);
     }
     handleSelectedFile(event){
         this.setState({
             selectedFile: event.target.files[0],
             loaded: 0,
         })
     }
     handleSubmit(event) {
         event.preventDefault();
         const data  = new FormData();
         data.append('file',this.state.selectedFile,this.state.selectedFile.name);
         axios
             .post('http://localhost:8001/upload', data, {
                 onUploadProgress: ProgressEvent => {
                     this.setState({
                         loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                     })
                 },
             })
             .then(res => {
                 console.log(res.statusText)
             })

     }
    render() {
       return(
           <div className="App">
               <input type="file" name="" id="" onChange={this.handleSelectedFile} />
               <button onClick={this.handleSubmit}>Upload</button>
               <div> {Math.round(this.state.loaded,2) } %</div>
           </div>
       )
    }
}
ReactDOM.render(
   <Uploader />,
    document.getElementById('root')
);
