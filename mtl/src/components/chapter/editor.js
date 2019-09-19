import React, { Component } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import 'react-image-crop/dist/ReactCrop.css';
import { Grid, Box, Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/SaveOutlined'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'
import TextField from '@material-ui/core/TextField';
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
        const defaultSettings = { swipeMode: true, hideRaw: true, priority: false }
        this.storage = JSON.parse(localStorage.getItem("chapterSettings") || JSON.stringify(defaultSettings))
        console.log(this.storage)
        this.state = {
            chapters: props.chapters,
            swipeMode: this.storage.swipeMode,
            priority: this.storage.priority,
        };



    }

    toggleSettings = (attr, val) => {
        if (["hideRaw", "swipeMode", "priority"].includes(attr)) {
            if (attr === 'hideRaw') this.setState({ raw: { ...this.state.raw, hide: val } })
            else this.setState({ [attr]: val })
            this.storage[attr] = val
            localStorage.setItem("chapterSettings", JSON.stringify(this.storage))
        }

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
        const arr = this.state.priority ? ["proofread", 'baidu', 'sogou', 'raw'] : ["proofread", 'sogou', 'baidu', 'raw']
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

        json.raw.hide = this.storage.hideRaw

        console.log("chapters state", json)

        this.setState(json)

    }





    translate = (terms) => {
        if (!this.state.paragraphs) return false;
        ["baidu", "sogou", "proofread"].forEach(t => {
            terms.forEach(term => {
                this.setState({
                    ...this.state, [t]: {
                        ...this.state[t],
                        content: this.state[t].content.replace(
                            new RegExp(term.from, "gi"), `<strong title='${term.from}'>${term.to}</strong>`)
                    }
                })
            })

        })
        this.editParagraphs(this.state)
    }


    submit = (attr, val) => {
        console.log(this.state)
        console.log("submitting", attr, val, this.props.match.path)
        let json = { [attr]: val }
        axios.post(`/api/novel/${this.state.novel_id}/chapter/${this.state.id}`, json)
            .then(res => {
                console.log(res)

            })
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







    render() {
        const { classes } = this.props;
        const { state, parent } = this;



        /* if (this.state.redirect) {
            return <Redirect to={`./${this.state.redirect}`} />
        } */

        if (!state.paragraphs)
            return <ProgressBar />

        const views = ['raw', 'proofread', 'sogou', 'baidu'].filter(key => !state[key].hide)

        if (state.edit || state.paragraphs.length === 0) {
            if (["raw", "proofread"].includes(state.edit))
                return (<Box component="div">
                    <TextField
                        autoComplete="off"
                        variant="outlined"
                        name="title"
                        placeholder={state.edit === 'raw' ?
                            "If possible use the userscript tools to semi-automatically generate this content" :
                            "Proofread content is shown as priority"
                        }
                        label={`${state.edit} title`}
                        value={state[state.edit].title || ""}
                        onChange={e => this.setState({ [state.edit]: { ...state[state.edit], title: e.target.value }})}
                        margin="normal"
                        fullWidth
                    />

                    <TextField
                        autoComplete="off"
                        variant="outlined"
                        name="content"
                        multiline={true}
                        rows={5}
                        rowsMax={30}
                        placeholder={state.edit === 'raw' ?
                            "If possible use the userscript tools to semi-automatically generate this content" :
                            "Proofread content is shown as priority"
                        }
                        label={`${state.edit} content`}
                        value={state[state.edit].content || ""}
                        onChange={e => this.setState({ [state.edit]: { ...state[state.edit], content: e.target.value }})}
                        margin="normal"
                        fullWidth
                    />
                    <Button variant="outlined" onClick={this.submit('raw', state.raw)}>
                        <SaveIcon fontSize="small" />
                        Submit
                </Button>

                    <Button variant="outlined" onClick={e => this.setState({ edit: false })}>
                        <SaveIcon fontSize="small" />
                        Cancel
                    </Button>
                </Box>
                )

            return (
                <Grid container style={{ marginTop: "3em" }}>
                    <Grid item md={12} style={{ textAlign: "left" }}>
                        <TextField
                            autoComplete="off"
                            type="number"
                            min={1}
                            variant="outlined"
                            name="Chapter number"
                            placeholder="Chapter number"

                            label={`Chapter ${state.order}`}
                            value={state.new ? state.new.order : state.order}
                            onChange={e => this.setState({ new: { url: this.state.new ? this.state.new.url : this.state.url, order: e.target.value } })}
                            margin="normal"
                            fullWidth
                        />
                        {state.new && state.new.order > 0 &&

                            <Button style={{ marginBottom: "2em" }} onClick={() => this.submit('order', state.new.order)}>
                                <SaveIcon fontSize="small" />
                                Save
                                    {state.chapters.find(c => c.order === parseInt(state.new.order)) &&
                                    <Typography component="span" color="secondary">&nbsp; (Already in use)</Typography>
                                }
                            </Button>
                        }


                    </Grid>
                    <Grid item md={12} style={{ marginBottom: "2em", textAlign: "left" }}>
                        <TextField
                            autoComplete="off"
                            type="url"
                            variant="outlined"
                            name="url"
                            placeholder="RAW url (optional)"
                            label={`RAW URL (optional)`}
                            value={state.new ? state.new.url : state.url}
                            onChange={e => this.setState({ new: { order: this.state.new ? this.state.new.order : this.state.order, url: e.target.value } })}
                            margin="normal"
                            fullWidth
                        />
                        {state.new && state.new.url !== state.url &&
                            <Button style={{ marginBottom: "2em" }} onClick={() => this.submit('url', state.new.url)}
                            >
                                <SaveIcon fontSize="small" />
                                Save
                            </Button>
                        }
                    </Grid>

                    <Grid style={{ textAlign: "center" }} item md={6} xs={12}>
                        <Button onClick={() => this.setState({ edit: "raw" })}>
                            {state.raw_id ? 'Add' : 'Edit'} RAW
                        </Button>
                    </Grid>
                    <Grid style={{ textAlign: "center" }} item md={6} xs={12}>
                        <Button onClick={() => this.setState({ edit: "proofread" })}>
                            {state.proofread_id ? 'Add' : 'Edit'} Proofread
                        </Button>
                    </Grid>
                    {state.raw_id &&
                        < Grid style={{ textAlign: "right", marginTop: "2em" }} item md={6} xs={12}>
                            <Button color="secondary" onClick={() => this.setState({ edit: false })}>
                                <KeyboardReturnIcon fontSize="small" />
                                Return
                            </Button>
                        </Grid>
                    }
                </Grid>
            )
        }
        return (
            <Container type="div" className={classes.root} >
                <this.ChapterNav />


                <Grid container spacing={3} className={classes.paragraphs}>
                    {state.paragraphs.map((p, index) => {
                        if (!views.includes(p.type) || (state.swipeMode && p.hide)) return null
                        return <Paragraph key={index}
                            parent={this}
                            md={state.swipeMode ? 12 : (12 / views.length)}
                            paragraph={p}
                            words={p.row + 1 === state.max_paragraphs ? state[p.type].content : null}
                        />
                    })}





                </Grid>

                <this.ChapterNav />
                <div>{state.swipeMode ? 'swipe' : 'noswipe'}</div>
                <ChapterSnackbar count={state.proofread.count} max={state.max_paragraphs} />



                <ChapterBottomNav parent={this} />

            </Container>



        );
    }
}

export default withStyles(styles)(ChapterEditor);