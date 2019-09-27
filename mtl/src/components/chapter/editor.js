import React, { Component } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import 'react-image-crop/dist/ReactCrop.css';
import { Grid, Box, Container } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/SaveOutlined'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'
import TranslateIcon from '@material-ui/icons/TranslateRounded'
import EditIcon from '@material-ui/icons/EditOutlined'
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
        const defaultSettings = {
            swipeMode: true,
            hideRaw: true,
            priority: false,
        }
        this.storage = JSON.parse(localStorage.getItem("chapterSettings") || JSON.stringify(defaultSettings))
        console.log(this.storage)
        this.state = {
            chapters: props.chapters,
            swipeMode: this.storage.swipeMode,
            priority: this.storage.priority,
            edit: {},
            new: {},
        };
    }

    generateTranslateString() {
        let r = JSON.stringify({
            url: `${global.config.server.api}/novel/${this.props.chapter.novel_id}/chapter`,
            chapter_id: [this.props.chapter.id],
            force: true
        })
        navigator.clipboard.writeText(r);
        alert(`Copied to clipboard: ${r}`);

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
            .then(() => document.title = `C${this.state.order} - ${this.props.parent.state.name}`)
            .then(() => localStorage.setItem(`novel${this.state.novel_id}`, this.state.order))
            .then(() => console.log(this.state))
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
        console.log("pps", this.state.paragraphs)
        /*  check the content of all 4 possible translations and split them by paragraph 
            calculate the maximum number of paragraphs as we wanna show all nth-paragraphs at same place 
        */
        const paragraphs = ['raw', 'baidu', 'sogou', 'proofread'].map(key => {
            if (!json[key]) {
                json[key] = { hide: false, content: '', original: '', title: '' }
                return { type: key, paragraphs: [], originals:[], priority: false }
            }


            // get the content
            let content = json[key].content.replace(/\n{2,}/g, '\n');
            // save the original content for translations if this is the first load
            json[key].original = json[key].original || content;
            let ps = content.split('\n').filter(el => el.trim() !== '')
            let originals = json[key].original.split('\n').filter(el => el.trim() !== '')
            

            // split content into paragraphs and remove double-spaces and empty parts

            // record the max number of paragraphs
            max_paragraphs = ps.length > max_paragraphs ? ps.length : max_paragraphs;

            return { type: key, paragraphs: ps, originals: originals, priority: json[key].priority }
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
                    original: translation.originals[i] || '',
                    row: i,
                    hide: translation.priority || translation.type === 'raw' ? false : true
                }

                // maybe hide empty translations?
                //if(["baidu", "sogou"].includes(translation.type) && translation.paragraphs.length === 0)

                json.paragraphs.push(p)

            }
            //)
        }
        let chap = this.props.chapter
        json.raw.hide = chap.sogou_id || chap.baidu_id || chap.proofread_id ? this.storage.hideRaw : false

        console.log("chapters state", json)

        this.setState(json)

    }


    SubmitChapter = (attr, val) => {
        console.log(this.state.edit)
        let json = { [attr]: val }
        if (['raw', 'proofread'].includes(attr))
            json = { translator: attr, content: val }
        console.log(json)
        axios.post(`/api/novel/${this.state.novel_id}/chapter/${this.state.id}`, json)
            .then(res => {
                if (!res.data.chapter_id) return false
                if (attr === 'order')
                    return this.props.parent.setState({ redirect: val })
                if (attr === 'url') return this.props.parent.fetchNovel()
                this.setState({ edit: {} })
                this.componentDidMount()

            }).catch(err => console.log(err.message))
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
                    <MenuItem key={c.id} component={Link}
                        disabled={c.id === this.state.id}
                        autoFocus={c.id === this.state.id}
                        to={`${c.order}`} value={c.id}>{`${c.order} - ${c.title}`}</MenuItem>
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
        const { state } = this;


        if (!state.paragraphs)
            return <ProgressBar />

        const views = ['raw', 'proofread', 'sogou', 'baidu']
            .filter(key => !state[key].hide)
            .filter(key => ['raw', 'proofread'].includes(key) || state[`${key}_id`])

        if (state.edit.translator || state.paragraphs.length === 0) {
            if (["raw", "proofread"].includes(state.edit.translator))
                return (<Box component="div">
                    <TextField
                        autoComplete="off"
                        variant="outlined"
                        name="title"
                        placeholder={state.edit === 'raw' ?
                            "If possible use the userscript tools to semi-automatically generate this content" :
                            "Proofread content is shown as priority"
                        }
                        label={`${state.edit.translator} title`}
                        value={state.edit.title || state[state.edit.translator].title}
                        onChange={e => this.setState({ edit: { ...state.edit, title: e.target.value } })}
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
                        label={`${state.edit.translator} content`}
                        value={state.edit.content || state[state.edit.translator].content}
                        onChange={e => this.setState({ edit: { ...state.edit, content: e.target.value } })}
                        margin="normal"
                        fullWidth
                    />
                    <Button variant="outlined" onClick={() => this.SubmitChapter(state.edit.translator, state.edit)}>
                        <SaveIcon fontSize="small" />
                        Submit
                </Button>

                    <Button variant="outlined" onClick={e => this.setState({ edit: {} })}>
                        <SaveIcon fontSize="small" />
                        Cancel
                    </Button>
                </Box>
                )

            return (
                <Grid container style={{ marginTop: "3em" }}>

                    <Grid item xs={12} style={{ marginBottom: "2em", textAlign: "right" }}>
                        <Button color="primary"
                            onClick={() => this.generateTranslateString()}
                        >
                            <TranslateIcon fontSize="small" />
                            Translate command

                                </Button>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "left" }}>
                        <TextField
                            autoComplete="off"
                            type="number"
                            min={1}
                            variant="outlined"
                            name="Chapter number"
                            placeholder="Chapter number"

                            label={`Chapter number`}
                            value={state.new.order || state.order}
                            onChange={e => this.setState({ new: { ...this.state.new, order: e.target.value } })}
                            margin="normal"
                            fullWidth
                        />
                        {state.new && state.new.order > 0 && state.new.order !== state.order &&

                            <Button style={{ marginBottom: "2em" }} onClick={() => this.SubmitChapter('order', state.new.order)}>
                                <SaveIcon fontSize="small" />
                                Save
                                    {state.chapters.find(c => c.order === parseInt(state.new.order)) &&
                                    <Typography component="span" color="secondary">&nbsp; (Already in use)</Typography>
                                }
                            </Button>
                        }


                    </Grid>

                    <Grid item xs={12} md={12} style={{ marginBottom: "2em", textAlign: "left" }}>
                        <TextField
                            autoComplete="off"
                            type="url"
                            variant="outlined"
                            name="url"
                            placeholder="RAW url (optional)"
                            label={`RAW URL (optional)`}
                            value={state.new.url ? state.new.url : (state.url || "")}
                            onChange={e => this.setState({ new: { ...this.state.new, url: e.target.value } })}
                            margin="normal"
                            fullWidth
                        />
                        {state.new && state.new.url !== state.url &&
                            <Button style={{ marginBottom: "2em" }} onClick={() => this.SubmitChapter('url', state.new.url)}
                            >
                                <SaveIcon fontSize="small" />
                                Save
                            </Button>
                        }
                    </Grid>

                    <Grid style={{ textAlign: "center" }} item md={6} xs={6}>
                        <Button onClick={() => this.setState({ edit: { translator: "raw" } })}>
                            <TranslateIcon fontSize="small" />
                            {state.raw_id ? 'Add' : 'Edit'} RAW
                        </Button>
                    </Grid>
                    <Grid style={{ textAlign: "center" }} item md={6} xs={6}>
                        <Button onClick={() => this.setState({ edit: { translator: "proofread" } })}>
                            <EditIcon fontSize="small" />
                            {state.proofread_id ? 'Add' : 'Edit'} Proofread
                        </Button>
                    </Grid>
                    {state.raw_id &&
                        <Grid style={{ textAlign: "right", marginTop: "2em" }} item md={6} xs={12}>
                            <Button color="secondary" onClick={() => this.setState({ edit: {} })}>
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
                <ChapterSnackbar parent={this} count={state.proofread.count} max={state.max_paragraphs} />



                <ChapterBottomNav parent={this} />

            </Container>



        );
    }
}

export default withStyles(styles)(ChapterEditor);