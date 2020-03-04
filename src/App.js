import React from 'react';
import 'quill/dist/quill.snow.css';
import './App.css';
import DesignSection from './components/DesignSection/DesignSection';

function getUrlVars(currentUrl) {
  var vars = {};
  currentUrl.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function(m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}

// import GlobalEditOptions from "./components/GlobalEditOptions/GlobalEditOptions";
let redirectUri = 'http://dev.roman3.io/';
let currentUrl =  decodeURIComponent(window.location.href);
  if(!localStorage.getItem("id_token") && Object.keys(getUrlVars(currentUrl)).length) {
    localStorage.setItem("id_token", getUrlVars(currentUrl).token);
    window.location.assign(currentUrl.split('?')[0]);
  }
  else if (!localStorage.getItem("id_token")) {
    // if (window.confirm("Please login first!")) {
    //   window.location.assign(redirectUri);
    // }
  }
  else if(localStorage.getItem("id_token") && getUrlVars(currentUrl).token !== undefined){
    window.location.assign(currentUrl.split('?')[0]);
  }

function App() {
  return (
    <div className="App">
      <DesignSection />
    </div>
  );
}

export default App;
