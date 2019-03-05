import React from 'react';
import ReactDOM from 'react-dom';
import './css/footer.css';

export class Footer extends React.Component{
    constructor(props){
        super(props);
    }


    render() {
        return(
          <div className="footerContainer">
              <div className="unilogos" id="footer-uni">
                  <div className="unilogos-content">
                      <a href="http://www.gsu.edu.tr" title="Galatasaray Üniversitesi">
                          <div className="unilogo" id="unilogo1"></div>
                      </a>
                      <a href="http://www.univ-ovidius.ro" title="Universitatea Ovidius din Constanta">
                          <div className="unilogo" id="unilogo2"></div>
                      </a>
                      <a href="http://www.utu.fi" title="University of Turku">
                          <div className="unilogo" id="unilogo3"></div>
                      </a>
                      <a href="http://www.univ-nantes.fr/" title="Université de Nantes">
                          <div className="unilogo" id="unilogo4"></div>
                      </a>
                      <a href="http://www.auf.org/" title="Agence universitaire de la Francophonie">
                          <div className="unilogo" id="unilogo5"></div>
                      </a>
                  </div>
                  <h5>Revue électronique internationale publiée par quatre universités partenaires : Galatasaray
                      (Istanbul, Turquie), Ovidius (Constanta, Roumanie), Turku (Finlande) et <br/>Nantes (France) avec
                          le soutien de l'Agence universitaire de la Francophonie (AUF)
                          <br/>ISSN 1308-8378</h5>
              </div>
          </div>
        );
    }
}