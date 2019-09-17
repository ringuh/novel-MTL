import React, { Component } from 'react';
import { Redirect, Link, BrowserRouter, Switch, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import ChapterEditor from './editor'

const styles = theme => ({

    paragraphs: {
        textAlign: 'left'
    },

    bottom: {
        position: "sticky",
        bottom: "0px"

    },

    chapterNav: {
        margin: "2em auto"
    }
});


class Chapter extends Component {
    constructor(props) {
        super(props);
        console.log("chapter", props)
        this.state = {};

    }

    componentDidMount() {
        console.log("mount", this.state)
        document.title = `Chapter`
        this.fetchNovel(this.props.match.params.alias)
    }

    componentDidUpdate() {
    }

    fetchNovel = (alias = this.state.id) => {
        return fetch(`/api/novel/${alias}`)
            .then(response => response.json())
            .then(data => { console.log("novelinfo", data); return data })
            .then(data => this.setState({ ...this.state, ...data }))
            .then(() => document.title = `${this.state.name}`)
            .then(() => this.fetchChapters())
    }

    fetchChapters = () => {
        return fetch(`/api/novel/${this.state.id}/chapter?content_length=paragraphs`)
            .then(response => response.json())
            .then(data => { console.log(data); return data })
            .then(data => this.setState({ chapters: data }))
            .then(() => {
                return true
                if (this.state.chapters.length === 0)
                    this.setState({ redirect: `/novels/${this.props.alias}` })
                else if (!this.props.order)
                    this.setState({
                        redirect: `/novels/${this.state.alias}/chapter/${this.state.chapters[0].order}`
                    })
                /*  else if(!this.state.chapters.find(c => c.order === this.props.chapter_nr))
                     console.log("chapter not found")
                     //this.setState({redirect: `/novels/${this.state.alias}/chapter`}) */
            })
    }


    render() {
        const { classes } = this.props;
        const { state } = this;

        /* if (state.redirect)
            return <div>Redirect to={state.redirect}</div> */

        return (
            <Container type="div">
                <Link to={`${state.redirect}`} >{state.redirect}</Link>
                {JSON.stringify(this.state)}
                <hr />
                {JSON.stringify(this.props.match)}

                {/* <Route exact path={`${this.props.match.path}/:order`} component={ChapterEditor} /> */}

                <h3>{JSON.stringify(this.props.order)} | {this.props.match.path}/:order!</h3>
                
                <Route
                    path={`${this.props.match.path}/:order`}
                    render={(props) => <ChapterEditor {...props} chapter_id={true} />}
                />

            </Container>



        );
    }
}

export default withStyles(styles)(Chapter);