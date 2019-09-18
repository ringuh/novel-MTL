import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import MainPage from './components/main_page'
import Novel from './components/novel/novel'
import NovelList from './components/novel/novel_list'
import Chapter from './components/chapter/chapter'
import PageNotFound from './components/page_not_found'
import Footer from './components/page_footer'
import Header from './components/page_header'
import Container from '@material-ui/core/Container'




function App() {
  return (
    <Container className="App" maxWidth="lg">
      <CssBaseline />
      <Header />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/novel" component={NovelList} />
          <Route exact path="/novel/:alias" component={Novel} />
          <Route exact path={[
            `/novel/:alias/chapter`,
            `/novel/:alias/chapter/:order`
          ]} component={Chapter} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
      <Footer />
    </Container>
  );
}

export default App;
