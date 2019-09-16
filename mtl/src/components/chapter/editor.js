import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import 'react-image-crop/dist/ReactCrop.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid, Box, Container } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ChapterBottomNav from './bottom_nav'
import Button from '@material-ui/core/Button'

import Paragraph from './paragraph'
import ChapterSnackbar from './chapter_snackbar'
import ChapterSettings from './chapter_settings'
import ForwardIcon from '@material-ui/icons/ArrowForwardIos'
import BackIcon from '@material-ui/icons/ArrowBackIos'




const styles = {

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
};


class ChapterEditor extends Component {
    constructor(props) {
        super(props);
        console.log("chapter editor", props)
        this.state = {
            id: props.match.params.chapter_id,
            novel_id: props.match.params.novel_id,
            swipeMode: true
        };

    }



    matches = "matches"

    formChange(e) {
        this.setState({
            novel: { ...this.state.novel, ...{ [e.target.name]: e.target.value } },
            //message: null,
            //error: false 
        })


    }

    componentDidMount() {
        if (!this.state.id) return false
        fetch(`/api/${this.props.match.url}`)
            .then(response => response.json())
            .then(data => this.priority(data))
            .then(data => this.editParagraphs(data))
            //.then(data => this.setState(data))
            .then(st => console.log(this.state))
    }


    componentDidUpdate() {
        document.title = `set title fucksake`

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
        console.log(json)

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

        json.raw.hide = true

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
        if (!this.state.id) return true
        return <Box component="div" style={{ margin: "2em auto" }}>
            <Button component="a" fullWidth
                variant="outlined"
                color="secondary"
                href={this.state.id - 1}>
                <BackIcon /> Previous
            </Button>

            <Select fullWidth
                value={this.state.id}
                onChange={() => console.log("hei")}
            >

                <MenuItem value="">Chapterlist at some point</MenuItem>

            </Select>


            <Button component="a" fullWidth
                variant="outlined"
                color="secondary"
                href={this.state.id + 1}>
                Next
                <ForwardIcon />
            </Button>
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
            return (
                <LinearProgress color="secondary" />
            )
        const views = ['raw', 'proofread', 'sogou', 'baidu'].filter(key => !state[key].hide)
        console.log(views)

        return (
            <Container type="div">
                <this.ChapterNav />



                <Grid container spacing={3} className={classes.paragraphs}>
                    {this.state.paragraphs.map((p, index) => {
                        if (!views.includes(p.type) || index > 17 || (state.swipeMode && p.hide)) return null
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

                <ChapterSettings settings={this.toggleSettings} chapter={this.state} />

                <ChapterBottomNav
                    novel_id={state.novel_id}
                    translate={this.translate}
                    paragraphs={state.paragraphs}
                    chapter_id={state.id} />

            </Container>



        );
    }
}

export default withStyles(styles)(ChapterEditor);