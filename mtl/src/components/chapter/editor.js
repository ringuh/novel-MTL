import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import 'react-image-crop/dist/ReactCrop.css';
import { Grid, Box, Container } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ChapterBottomNav from './bottom_nav'
import Button from '@material-ui/core/Button'
import ProgressBar from '../util/ProgressBar'
import Paragraph from './paragraph'
import ChapterSnackbar from './chapter_snackbar'
import ForwardIcon from '@material-ui/icons/ArrowForwardIos'
import BackIcon from '@material-ui/icons/ArrowBackIos'




const styles = theme => ({
    root: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    paragraphs: {
        textAlign: 'left'
    },

    bottom: {
        position: "sticky",
        bottom: "0px"

    },

    chapterNav: {
        margin: "2em auto",
    },
    breadcrumbs: {}
});


class ChapterEditor extends Component {
    constructor(props) {
        super(props);
        console.log("chapter editor", props)
        this.state = {
            chapters: props.chapters,
            swipeMode: true,
        };

    }

    formChange(e) {
        this.setState({
            novel: { ...this.state.novel, ...{ [e.target.name]: e.target.value } },
        })


    }

    componentDidMount() {
        if (!this.props.chapter.id) return false

        fetch(`/api/novel/${this.props.chapter.novel_id}/chapter/${this.props.chapter.id}`)
            .then(response => response.json())
            .then(data => this.priority(data))
            .then(data => this.editParagraphs(data))
            //.then(data => this.setState(data))
            .then(st => console.log(this.state))
    }


    componentDidUpdate() {
        // if chapter has changed reload everything
        if (this.props.chapter.id !== this.state.id) {
            this.componentDidMount()
        }

    }

    // check which paragraph to prioritize based on existence
    // proofread > baidu > sogou
    priority(data) {
        const arr = ["proofread", 'baidu', 'sogou', 'raw']
        for (var i in arr) {
            const trans = arr[i]
            if (data[trans] && data[trans].content.length > 0) {
                data[trans].priority = true

                break
            }
        }

        return data
    }


    editParagraphs(json) {
        let max_paragraphs = 0

        /*  check the content of all 4 possible translations and split them by paragraph 
            calculate the maximum number of paragraphs as we wanna show all nth-paragraphs at same place 
        */
        const paragraphs = ['raw', 'baidu', 'sogou', 'proofread'].map(key => {
            if (!json[key]) {
                json[key] = { hide: false, content: '', title: '' }
                return { type: key, paragraphs: [], priority: false }
            }

            //do smth 

            // get the content
            let ps = json[key].content.replace(/\n{2,}/g, '\n');
            ps = ps.split('\n')
            ps = ps.filter(el => el.trim() !== '')
            // split content into paragraphs and remove double-spaces and empty parts

            // record the max number of paragraphs
            max_paragraphs = ps.length > max_paragraphs ? ps.length : max_paragraphs;

            return { type: key, paragraphs: ps, priority: json[key].priority }
        })
        json.max_paragraphs = max_paragraphs
        json.paragraphs = []
        for (var i = 0; i < max_paragraphs; ++i) {
            for (var j in paragraphs) {
                const translation = paragraphs[j]
                //paragraphs.forEach((translation, index) => {
                let p = {
                    type: translation.type,
                    content: translation.paragraphs[i] || '',
                    row: i,
                    hide: translation.priority || translation.type === 'raw' ? false : true
                }



                json.paragraphs.push(p)

            }
            //)
        }

        json.raw.hide = false

        console.log("chapters state", json)

        this.setState(json)

    }

    proofreadParagraph = (event, paragraph) => {
        //event.preventDefault()
        console.log(paragraph)
        console.log(event.target.value)

        let val = event.target.value
        if (!this.state.newLine)
            val = val.replace(/\n/g, ' ')
        val = val.replace(/\n{2,}/g, '\n');
        val = val.replace(/ {2,}/g, ' ');
        paragraph.content = val
        this.setState({ ...this.state })

    }

    selectParagraph = (paragraph, option = 0) => {
        console.log(paragraph, option)

        let alternatives = this.state.paragraphs.filter(p =>
            p.row === paragraph.row && p.type !== 'raw')
        const proofread = alternatives.find(p => p.type === "proofread")
        alternatives = alternatives.filter(p => p.content.length > 0)

        if (option === 0) { // pre-selecting proofread content
            // allow long press on translation to replace proofread if empty or exactly same as a translation
            if (proofread.content.length === 0 || alternatives.find(p => p.content === proofread.content))
                proofread.content = paragraph.content
            console.log(proofread.content)
            paragraph.hide = true
            proofread.hide = false



            return this.setState({
                ...this.state,
                proofread: {
                    ...this.state.proofread,
                    count: this.state.paragraphs.filter(p => p.type === 'proofread' && p.content.length > 0).length
                },
                paragraphs: this.state.paragraphs
            })
        }

        const index = alternatives.indexOf(paragraph)
        let targetIndex = index + option
        if (targetIndex >= alternatives.length) targetIndex = 0
        else if (targetIndex < 0) targetIndex = alternatives.length - 1

        paragraph.hide = true
        alternatives[targetIndex].hide = false

        this.setState({ ...this.state, paragraphs: this.state.paragraphs })

    }

    translate = (terms) => {
        if (!this.state.paragraphs) return false;
        ["baidu", "sogou", "proofread"].forEach(t => {
            terms.forEach(term => {
                this.setState({
                    ...this.state, [t]: {
                        ...this.state[t],
                        content: this.state[t].content.replace(
                            new RegExp(term.from, "gi"), `<strong>${term.to}</strong>`)
                    }
                })
            })

        })
        this.editParagraphs(this.state)
    }

    ChapterNav = () => {
        const chapterIndex = this.state.chapters.findIndex(c => c.id === this.state.id)
        const prev = chapterIndex > 0 ? this.state.chapters[chapterIndex - 1] : null
        const next = this.state.chapters.length - 1 > chapterIndex ? this.state.chapters[chapterIndex + 1] : null

        return <Box component="div" style={{ margin: "2em auto" }}>
            {prev &&
                <Button component={Link} fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.setState({ paragraphs: null })}
                    to={`${prev.order}`}>
                    <BackIcon /> {`Chapter ${prev.order}` || `${prev.order}. ${prev.title}`}
                </Button>
            }
            <Select fullWidth style={{ margin: "1.5em auto", border: "1px solid black", backgroundColor: 'var(--gray)' }}
                value={this.state.id}
                onChange={() => this.setState({ paragraphs: null })}
            >
                {this.state.chapters.map(c =>
                    <MenuItem key={c.id} component={Link} to={`${c.order}`} value={c.id}>{`${c.order} - ${c.title} ${c.id}`}</MenuItem>
                )}


            </Select>


            {next &&
                <Button component={Link} fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => this.setState({ paragraphs: null })}
                    to={`${next.order}`}>
                    {`Chapter ${next.order}` || `${next.order}. ${next.title}`}
                    <ForwardIcon />
                </Button>
            }
        </Box>

    }

    toggleSettings = (attr, val) => {
        console.log("toggle settings", attr, val)
        if (attr === 'hideRaw')
            return this.setState({ ...this.state, raw: { ...this.state.raw, hide: val } })
        if (attr === 'swipeMode')
            return this.setState({ ...this.state, swipeMode: val })
    }



    render() {
        const { classes } = this.props;
        const { state } = this;

        

        /* if (this.state.redirect) {
            return <Redirect to={`./${this.state.redirect}`} />
        } */

        if (!state.paragraphs)
            return <ProgressBar />
            
        const views = ['raw', 'proofread', 'sogou', 'baidu'].filter(key => !state[key].hide)

        return (
            <Container type="div" className={classes.root}>
                <this.ChapterNav />



                <Grid container spacing={3} className={classes.paragraphs}>
                    {this.state.paragraphs.map((p, index) => {
                        if (!views.includes(p.type) || (state.swipeMode && p.hide)) return null
                        return <Paragraph key={index}
                            selectParagraph={this.selectParagraph}
                            proofreadParagraph={this.proofreadParagraph}
                            views={views}
                            paragraph={p}
                        />
                    })}
                </Grid>

                <this.ChapterNav />
                <div>{state.swipeMode ? 'swipe' : 'noswipe'}</div>
                <ChapterSnackbar count={state.proofread.count} max={state.max_paragraphs} />

                

                <ChapterBottomNav
                    parent={this}
                    novel_id={this.props.chapter.novel_id}
                    translate={this.translate}
                    paragraphs={state.paragraphs}
                    chapters={state.chapters}
                    chapter_id={this.props.chapter.id} />

            </Container>



        );
    }
}

export default withStyles(styles)(ChapterEditor);