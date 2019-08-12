import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import NovelEditor from './novel_editor'
import NovelList from './novel_list';

class NovelIndex extends Component {
    constructor(props) {
        super(props);
        console.log("Novel index", props)
        this.state = {
            novels: [],
        };

        //this.handleChange = this.handleChange.bind(this);

        
        
    }

    componentDidMount() {
        //console.log(this.props.match.url, this.props.location.pathname)
        // dont fetch if not on main page
        
    }


    render() {
        
        return (
<div>
<h2> novellisivut {this.props.match.path} </h2>
    
    <Switch>
        <Route exact path={this.props.match.path} component={NovelList}/>
        <Route path={`${this.props.match.path}/:id`} component={NovelEditor} />
    </Switch>
    
    


        
    
    



</div>

            
        );
    }
}

export default NovelIndex;