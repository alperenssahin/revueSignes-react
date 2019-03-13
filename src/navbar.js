import React from 'react';
import './css/navbar.css';
import $ from 'jquery'
import {NavContent} from './navContent';
export class Navbar extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {url: '',text:''};
        this.close =this.close.bind(this);
    }

    componentDidMount() {
        this.navbar();
        window.addEventListener("resize", this.navbar.bind(this));
        window.addEventListener("click", this.click.bind(this));
        window.addEventListener("load", this.onload.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.navbar.bind(this));
        window.removeEventListener("click", this.click.bind(this));
        window.removeEventListener("load", this.onload.bind(this));
    }
    onload(){
        window.openTab = {url:'',text:''};
    }
    click() {
        this.setState({url: window.openTab.url, text:window.openTab.text});
    }

    navbar() {
        widthHeightControl();
    }
    close(){
        $(`.button.inside`).removeClass('active');
        $('.button.inside > i').css('color', "#1d2124");
        $('#res.navBar').css('display', 'none');
        $('.navOutside').css('display', 'none');
    }

    render() {
        return (

            <div id="container" className="navBar">
                <div id="res" className="navBar response">
                    <NavContent url={this.state.url} text={this.state.text}/>

                </div>
                <div className="navOutside" onClick={this.close}></div>
                <div id="inside" className="navBar">
                    <Navigator/>
                </div>
            </div>

        )
    }
}

class Navigator extends React.Component {
    render() {
        return (
            <div className="">
                <Buttonn id="search" icon="search" color="#1d2124" path="/search" linx ='true' text="Chercher"/>
                <div className="navBar marker search">
                    <hr/>
                </div>
                <Buttonn id="library" linx ='false' icon="library_books" color="#fa4638" path="numero" text="Numéros récents"/>
                <Buttonn id="appel" linx ='false'icon="open_in_browser" color="#f5ee2c" path="appel" text="Appel à Communication"/>
                <Buttonn id="index" linx ='false' icon="markunread_mailbox" color="#caf5e3" path="index" text="Accès par index"/>
                <Buttonn id="presentation" linx ='false' icon="more_vert" color="#ffc7c7" path="present" text="Présentation"/>
                <Buttonn id="admin" linx ='true' icon="account_balance" color="#adf" path="admin" text="Control Panel"/>
            </div>
        )
    }
}

class Buttonn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {desingI: {color: "#1d2124"}, active: false};
        this.handleClick = this.handleClick.bind(this);
        this.handleOver = this.handleOver.bind(this);
        this.handleOut = this.handleOut.bind(this);
    }

    handleClick() {
        if (this.props.linx === 'false') {
            if ($(`#${this.props.id}.button.inside`).hasClass('active')) {
                $(`#${this.props.id}.button.inside`).removeClass('active');
                $(`#${this.props.id}.button.inside > i`).css('color', "#1d2124");
                $('#res.navBar').css('display', 'none');
                $('.navOutside').css('display', 'none');
                window.openTab = {url:'',text:''};
            } else {
                $(`.button.inside`).removeClass('active');
                $('.button.inside > i').css('color', "#1d2124");
                $(`#${this.props.id}.button.inside > i`).css('color', this.props.color);
                $(`#${this.props.id}.button.inside`).addClass('active');
                $('#res.navBar').css('display', 'flex');
                $('.navOutside').css('display', 'block');
                window.openTab = {url: `m${this.props.id}`,text:this.props.text};
            }
        }
        if(this.props.id === 'admin'){
            window.location = '/admin';
        }
        if(this.props.id === 'search'){
           $('.out.searchBar').css('display','block');
            $('.out.searchBar').innerHeight(document.body.scrollHeight);
        }
    }

    handleOver() {
        $(`#${this.props.id}.button.inside > i`).css('color', this.props.color);
    }

    handleOut() {
        if (!$(`#${this.props.id}.button.inside`).hasClass('active')) {
            $(`#${this.props.id}.button.inside > i`).css('color', "#1d2124");
        }
    }

    render() {

        return (
            <div className="navBar button container" id={this.props.id}>

                <div className="button inside buttonx" id={this.props.id} onClick={this.handleClick}
                     onMouseOver={this.handleOver} onMouseOut={this.handleOut}><i
                    className="material-icons">
                    {this.props.icon}
                </i>
                    <div className="button text navBar"> {this.props.text}</div>
                </div>
            </div>
        )
    }
}

function widthHeightControl() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let n = $('#inside.navBar');
    let c = $('#container.navBar');
    let r = $('#res.navBar');
    let f = $('.button.frame');
    let o = $('.navOutside');
    let s =  $('.out.searchBar');
    let footer = $('.footerContainer');
    let logos = $('.unilogo')
    o.innerHeight(h);
    f.innerHeight(h);
    r.innerHeight(h);
    c.innerHeight(h);
    s.innerHeight(document.body.scrollHeight);
    console.log(w);
    if (w < 300) {
        resize(30,120,40);
    } else if (w < 600) {
        resize(50,150,40);
    } else if (w < 900) {
        resize(230,250,40);
    } else {
        resize(230,250,300);
    }
    function resize(nw,rw,fp){
        s.innerWidth(w);
        n.innerWidth(nw);
        r.css("left", `${nw+3}px`);
        r.innerWidth(rw);
        o.innerWidth(w-rw+nw);
        o.css('left',`${rw+nw+6}px`);
        footer.innerWidth(w-nw-fp);
        logos.innerWidth((w-nw-fp)/5);
        logos.innerHeight((w-nw-fp)/5*0.8);
    }
}

