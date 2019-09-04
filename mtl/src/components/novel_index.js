import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NovelEditor from './novel_editor'
import ChapterEditor from './chapter_editor'
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
                <h2> novellisivut {this.props.match.url} </h2>

                <Switch>
                    <Route exact path={this.props.match.path} component={NovelList} />
                    <Route exact path={`${this.props.match.path}/:id`} component={NovelEditor} />
                    <Route exact path={`${this.props.match.path}/:novel_id/chapter/:chapter_id`} component={ChapterEditor} />
                </Switch>










            </div>


        );
    }
}

export default NovelIndex;