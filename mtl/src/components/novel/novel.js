import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import NovelEditor from './novel_editor'
import NovelChapters from './novel_chapters'
import ProgressBar from '../util/ProgressBar'

const styles = theme => ({
    root: {

    }
});


class NovelIndex extends Component {
    constructor(props) {
        super(props);
        console.log("Novel index", props)
        this.state = {  };
    }

    //this.handleChange = this.handleChange.bind(this);

    componentDidMount() {
        document.title = "Fetching novel"
        this.fetchNovel(this.props.match.params.alias)

    }

    fetchNovel = (alias=this.state.id) => {
        return fetch(`/api/novel/${alias}`)
            .then(response => response.json())
            .then(data => { console.log("novelinfo", data); return data  })
            .then(data => this.setState({ ...this.state, ...data }))
            .then(() => document.title = `${this.state.name}`)
            .then(() => this.fetchChapters())
    }

    fetchChapters = () => {
        return fetch(`/api/novel/${this.state.id}/chapter?content_length=paragraphs`)
            .then(response => response.json())
            .then(data => { console.log(data); return data })
            .then(data => this.setState({ chapters: data }))
    }


    componentDidUpdate() {
        if(this.props.match.params.alias !== this.state.alias && parseInt(this.props.match.params.alias) !== this.state.id)
            this.fetchNovel(this.props.match.params.alias)
    }



    render() {
        const { classes } = this.props
        const state = this.state
        
        if (!state.name) return <ProgressBar />


        return (
            <div className={classes.root}>
                <NovelEditor novel={this.state} 
                    getNovel={this.fetchNovel} />

                <NovelChapters novel={this.state}
                    fetchChapters={this.fetchChapters} />








            </div>


        );
    }
}

export default withStyles(styles)(NovelIndex);