import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import NovelIndex from './components/novel_index'
import PageNotFound from './components/page_not_found'
import Footer from './components/page_footer'
import Header from './components/page_header'
import Login from './components/login'



function App() {
  return (
    <div className="App">
      {/* <Header/> */}
      {<Login></Login>}
      <h3>Tervetuloa</h3>
      	<BrowserRouter>
      		<Switch>
      			<Route path="/novel" component={NovelIndex} />
      			<Route component={PageNotFound} />
        	</Switch>
        </BrowserRouter>
      	<Footer/>
    </div>
  );
}

export default App;
