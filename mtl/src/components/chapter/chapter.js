import React, { Component } from 'react';
import { Redirect, Link, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import ChapterEditor from './editor'
import RedirectMe from '../util/RedirectMe'
import ProgressBar from '../util/ProgressBar';
import InfoIcon from '@material-ui/icons/Info';
const styles = theme => ({
    root: {

    },
    breadcrumbs: {
        "& a": {
            textDecoration: "none",
            color: "var(--secondary)"
        },
        "& svg": {
            top: "-1px",
            marginLeft: " 0.2em",
            position: "relative"
        }
    }
});


class Chapter extends Component {
    constructor(props) {
        super(props);
        console.log("chapter", props)
        this.state = {
            order: parseInt(props.match.params.order) || null,
            redirect: null
        };

    }

    redirectMe = () => {
        let r = this.state.redirect
        console.log("redir", r)
        this.setState({ redirect: null })
        return <Redirect to={r} />
    }

    componentDidMount() {
        document.title = `Chapter`
        this.fetchNovel(this.props.match.params.alias)
    }

    componentDidUpdate() {
        // check if props path has changed
        if (this.props.match.params.order && this.state.order !== parseInt(this.props.match.params.order)) {
            this.setState({ order: parseInt(this.props.match.params.order) })
            let chapter = this.state.chapters.find(c => c.order === parseInt(this.props.match.params.order))
            chapter ? this.setState({ chapter: chapter }) : this.fetchChapters()

        }
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
            //.then(data => { console.log(data); return data })
            .then(data => this.setState({ chapters: data }))
            .then(() => {
                // redirect to novel index if there arent any chapters for this novel
                if (this.state.chapters.length === 0)
                    this.setState({ redirect: `/novels/${this.props.match.params.alias}` })

                // check if a chapter can be found based on :order
                this.setState({ chapter: this.state.order ? this.state.chapters.find(c => c.order === this.state.order) : null })

                // if no chapter is found or :order is missing pick the first unread
                if (!this.state.chapter)
                    this.setState({
                        redirect: `/novel/${this.props.match.params.alias}/chapter/${this.state.chapters[0].order}`
                    })
                else document.title = `C${this.state.chapter.order} - ${this.state.name}`
            })
    }



    render() {
        const { classes } = this.props;
        const { state } = this;

        if (state.redirect) {
            return <RedirectMe state={state} />
        }

        if (!state.chapter) return <ProgressBar />

        return (
            <Container type="div" className={classes.root}>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className={classes.breadcrumbs}>
                    <Link to="/novel">Novels</Link>
                    <Link to={`/novel/${state.alias}`}>
                        {state.name}
                    </Link>
                    <Typography onClick={() => this.setState({ showSource: !state.showSource })} color="textPrimary">
                        Chapter {state.chapter.order}
                        <InfoIcon fontSize="small" color="action" m-l={2} />
                    </Typography>

                </Breadcrumbs>
                {state.showSource &&
                    <Typography variant="subtitle2" style={{ textAlign: "left" }} >
                        {state.chapter.url ?
                            (<span>Source: <a href={state.chapter.url} >{state.chapter.url}</a></span>) :
                            (<span>No source found for this chapter</span>)}
                    </Typography>}

                <Link to={`${state.redirect}`} >{state.redirect}</Link>

                {this.state.chapter &&
                    <ChapterEditor {...this.props} chapter={state.chapter} chapters={state.chapters} />
                }


             

            </Container>



        );
    }
}

export default withStyles(styles)(Chapter);

{/* <Route
path={`${this.props.match.path}`}
render={(props) => <ChapterEditor {...props} chapter={state.chapter} chapters={state.chapters} />}
/> */}