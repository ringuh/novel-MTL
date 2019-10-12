import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { Button, Box } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import AddSimpleIcon from '@material-ui/icons/AddOutlined';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';



const styles = theme => ({
    bottom: {
        '&:hover': {
            textDecoration: 'none',
        },
    },
    dialog: {
        "& .MuiDialog-paperWidthSm": {
            width: "100%",
            position: "fixed",
            maxHeight: "calc(100% - 32px)",
            top: 0,
            margin: 0,
        },


    },
    list: {
        minWidth: "300px",
    },
    right: {
        flex: 1,
        justifyContent: "start"
    }

});

const defaultTerm = {
    id: null,
    edit: true,
    prompt: false,
    proofread: false,
    from: "",
    to: "",
    string: ""
}


class TermDrawer extends Component {
    constructor(props) {
        super(props);
        console.log("terms", props)
        this.state = {
            novel_id: props.parent.props.parent.state.novel_id,
            edit: false,
            term: { ...defaultTerm },
        };

    }

    Translate = (terms = []) => {
        const editor = this.props.parent.props.parent
        if (!editor.state.paragraphs) return false;
        let paragraphs = editor.state.paragraphs.map(p => { return { ...p, content: p.original } })

        let contents = {
            proofread: editor.state.proofread.original,
            sogou: editor.state.sogou.original,
            baidu: editor.state.baidu.original
        }
        // dont try translating empty content
        let options = ['proofread', 'sogou', 'baidu'].filter(t => contents[t].length > 0)

        // auto translates
        terms.filter(t => !t.prompt).forEach(term => {
            term.from.split("|").map(f => {
                // names are often mis translated into one pile "Yu Mu chen" -> "Yumuchen"
                // so automatically offer the one pile version
                let a = f.trim()
                let b = a.replace(/\s/g, '')
                if (a === b) return a
                return [a, b]
                // REDUCE because .flat() didnt work on all mobile browsers
            }).reduce((acc, val) => acc.concat(val), []).forEach(from => {
                for (var j in options) {
                    var key = options[j]
                    // only translate the terms that are ment to translate proofread content
                    if (key === 'proofread' && !term.proofread) continue
                    const match = new RegExp(`\\b${from}\\b`, "gi")
                    // before splitting check if there is any match before doing any splitting
                    if (contents[key].match(match)) {
                        let arr = contents[key].split(/<strong (.*?)<\/strong>/)
                        for (var i in arr) {
                            if (arr[i].startsWith("title=")) arr[i] = `<strong ${arr[i]}</strong>`
                            else arr[i] = arr[i].replace(match, `<strong title='${from}'>${term.to}</strong>`)
                        }
                        contents[key] = arr.join("")
                    }
                }
            })




        });

        editor.setState({
            proofread: { ...editor.state.proofread, content: contents.proofread },
            sogou: { ...editor.state.sogou, content: contents.sogou },
            baidu: { ...editor.state.baidu, content: contents.baidu }
        })
        editor.editParagraphs(editor.state)

    }






    selectTerm = (term) => {
        this.props.parent.toggleState('term', false)
        if (term) {
            if (term === 'new')
                return this.setState({ edit: true, term: { prompt: false, from: "", to: "" } })

            return this.setState({ edit: true, term: { ...term, string: JSON.stringify(term) } })

        }



        this.setState({ edit: false, term: { ...defaultTerm } })

    }


    editTerm = (term, deleteTerm = false) => {
        let json = { ...term, delete: deleteTerm }

        axios.post(`/api/novel/${this.state.novel_id}/terms`, json)
            .then(res => {
                if (res.data.id) {
                    this.selectTerm()
                    this.componentDidMount()
                }
            })
    }

    componentDidMount() {
        axios.get(`/api/novel/${this.state.novel_id}/terms`)
            .then(response => response.data)
            .then(data => this.setState({ ...this.state, terms: data }))
            .then(st => console.log(this.state))
            //.then(st => this.props.parent.props.parent.translate(this.state.terms))
            .then(st => this.Translate(this.state.terms))
    }



    render() {
        const { classes, parent } = this.props;
        const { state, props } = this;

        if (!state.terms) return null

        return (
            <Box className={classes.bottom}>
                <Drawer
                    className={classes.drawer}
                    anchor="right"
                    open={parent.state.term}
                    onClose={() => parent.toggleState('term', false)}
                // onOpen={() => props.toggleState('term', true)}
                //onOpen={this.props.toggle('chapterDrawer', true)}
                >
                    <List className={classes.list}>
                        <ListSubheader
                            className={classes.subheader}>

                        </ListSubheader>
                        <ListItem button
                            onClick={() => this.selectTerm('new')}
                            dense={true}
                            divider={true}>
                            <ListItemIcon>
                                <AddIcon color="secondary" />
                            </ListItemIcon>

                            <ListItemText
                                primary="Add new term" />
                            <ListItemSecondaryAction>
                            </ListItemSecondaryAction>
                        </ListItem>

                        {state.terms.map((val, indx) => {
                            return (
                                <ListItem button key={indx}
                                    onClick={() => this.selectTerm(val)}
                                    dense={true}
                                    divider={true}>
                                    <ListItemText
                                        /* primary={val.from.split('|').map(from => <span key={from}>{from}<br /></span>)} */
                                        primary={val.to.split('|').map(to => <span key={to}>{to}<br /></span>)} />
                                    <ListItemSecondaryAction>
                                        <ListItemText
                                            primary={val.prompt ? 'Prompt' : 'Auto'} />


                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                        {state.terms.length > 5 &&
                            <ListItem button
                                onClick={() => this.selectTerm('new')}
                                dense={true}
                                divider={true}>
                                <ListItemIcon>
                                    <AddIcon color='secondary' />
                                </ListItemIcon>

                                <ListItemText
                                    primary="Add new term" />
                                <ListItemSecondaryAction>
                                </ListItemSecondaryAction>
                            </ListItem>}

                    </List>
                </Drawer>


                {state.edit &&
                    <Dialog open={state.edit}
                        className={classes.dialog}
                        scroll={"paper"}
                        onClose={() => this.selectTerm()}>
                        <DialogTitle onClick={() => this.setState({ info: !state.info })}>
                            Add a new term
                            <InfoIcon fontSize="small" color="secondary" />
                        </DialogTitle>
                        <DialogContent>
                            {state.info &&
                                <DialogContentText> {/* <span>{JSON.stringify(this.state.term)}</span> */}
                                    You can add a new <strong>english</strong> term to
                                    replace some of the words used in machine translation.
                                    Terms do not effect saved <strong>raw</strong> or <strong>proofread</strong> text
                                </DialogContentText>
                            }
                            {state.term.from.length > 0 &&
                                <Button color="primary"
                                    fontSize="small"
                                    onClick={(e) => this.setState({
                                        term: { ...state.term, from: `${state.term.from} | ` }
                                    })}> <AddSimpleIcon /> </Button>
                            }

                            <TextField fullWidth
                                onChange={(e) => this.setState({ term: { ...this.state.term, from: e.target.value } })}
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Term to translate"
                                placeholder="eg. tribulation"
                                type="text"
                                value={state.term.from}

                            />
                            
                            <Divider />
                            <TextField
                                onChange={(e) => this.setState({ term: { ...state.term, to: e.target.value } })}
                                margin="dense"
                                id="name"
                                label="Translation"
                                //placeholder="eg. kill | murder | separated by pipes"
                                placeholder="eg. kill"
                                type="text"
                                value={state.term.to}
                                fullWidth
                            />

                            {/* <Switch
                                checked={state.term.prompt}
                                onChange={(e) => this.setState({ term: { ...state.term, prompt: !state.term.prompt } })}
                                value={state.term.prompt} /> Prompt */}
                        </DialogContent>
                        <DialogActions>
                            {state.term.id &&
                                <div className={classes.right}>
                                    <Button
                                        onClick={() => this.editTerm(state.term, true)} color="secondary">
                                        Delete
                                </Button></div>}
                            <Button onClick={() => this.selectTerm()} color="primary">
                                Cancel
                            </Button>
                            {JSON.stringify(state.term) !== state.term.string &&
                                <Button onClick={() => this.editTerm(state.term)} color="secondary">
                                    Save
                            </Button>
                            }

                        </DialogActions>
                    </Dialog>}


                {state.prompt &&
                    <Dialog open={state.prompt}
                        className={classes.dialog}
                        onClose={() => false}>
                        <DialogTitle>Prompt</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {state.prompt}
                            </DialogContentText>

                        </DialogContent>
                        <DialogActions>

                            <Button onClick={() => this.selectTerm()} color="primary">
                                Return
                            </Button>
                        </DialogActions>
                    </Dialog>}


            </Box>
        );
    }
}

export default withStyles(styles)(TermDrawer);
