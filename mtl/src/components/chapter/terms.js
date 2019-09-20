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


import AddIcon from '@material-ui/icons/AddCircleOutline';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import ListSubheader from '@material-ui/core/ListSubheader';



const styles = theme => ({
    bottom: {
        '&:hover': {
            textDecoration: 'none',
        },
    },
    drawer: {
        minWidth: "300px"
    },
    list: {
        minWidth: "300px",
        maxWidth: "50%"
    },
    right: {
        flex: 1,
        justifyContent: "start"
    }

});


class TermDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            novel_id: props.novel_id,
            edit: false,
            term: {
                edit: true,
                prompt: false,
                from: "",
                to: ""
            }
        };

    }

    selectTerm = (term) => {
        if (term) {
            if (term === 'new')
                return this.setState({ edit: true, term: { prompt: false, from: "", to: "" } })

            return this.setState({ edit: true, term: { ...term, string: JSON.stringify(term) } })

        }



        this.setState({ edit: false, term: { prompt: false, from: "", to: "" } })

    }


    saveTerm = (term, del) => {
        let json = { ...term }
        if (del) json.prompt = del

        term.post = true
        axios.post(`/api/novel/${this.state.novel_id}/terms`, json)
            .then(res => {
                if (res.data.id) {
                    this.selectTerm()
                    this.componentDidMount()
                }

            })
    }


    componentDidMount() {
        fetch(`/api/novel/${this.state.novel_id}/terms`)
            .then(response => response.json())
            .then(data => this.setState({ ...this.state, terms: data }))
            .then(st => console.log(this.state))
            .then(st => this.props.translate(this.state.terms))



    }



    render() {
        const { classes } = this.props;
        const { state, props } = this;

        if (!state.terms) return null

        return (
            <Box className={classes.bottom}>
                <SwipeableDrawer
                    className={classes.drawer}
                    anchor="right"
                    open={props.open}
                    onClose={() => props.toggle('term', false)}
                    onOpen={() => props.toggle('term', true)}
                //onOpen={this.props.toggle('chapterDrawer', true)}
                >
                    <div
                        className={classes.list}
                        role="presentation">
                        <List>
                            <ListSubheader
                                className={classes.subheader}>

                            </ListSubheader>
                            <ListItem button
                                onClick={() => this.selectTerm('new')}
                                dense={true}
                                divider={true}>
                                <ListItemIcon>
                                    <AddIcon />
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
                                            primary={val.from}
                                            secondary={val.to.split('|').map(to => <span key={to}>{to}<br /></span>)} />
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
                                        <AddIcon color={'success'} />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary="Add new term" />
                                    <ListItemSecondaryAction>
                                    </ListItemSecondaryAction>
                                </ListItem>}

                        </List>


                    </div>
                </SwipeableDrawer>


                {state.edit &&
                    <Dialog open={state.edit} onClose={() => this.selectTerm()} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Add a new term</DialogTitle>
                        <DialogContent>
                            <DialogContentText> {/* <span>{JSON.stringify(this.state.term)}</span> */}
                                You can add a new <strong>english</strong> term to
                                replace some of the words used in machine translation.
                            Terms do not effect saved <strong>raw</strong> or <strong>proofread</strong> text
                        </DialogContentText>
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
                                onChange={(e) => this.setState({ term: { ...this.state.term, to: e.target.value } })}
                                margin="dense"
                                id="name"
                                label="Translation"
                                placeholder="eg. kill | murder | separated by pipes"
                                type="text"
                                value={state.term.to}
                                fullWidth
                            />

                            <Switch
                                checked={state.term.prompt}
                                //onChange={(e) => this.setState({ ...this.state, term: { ...this.state.term, prompt: !state.term.prompt } })}
                                value={state.term.prompt} /> Prompt
                        </DialogContent>
                        <DialogActions>
                            {state.term.id &&
                                <div className={classes.right}>
                                    <Button
                                        onClick={() => this.saveTerm(state.term, 'delete')} color="secondary">
                                        Delete
                                </Button></div>}
                            <Button onClick={() => this.selectTerm()} color="primary">
                                Cancel
                            </Button>
                            {JSON.stringify(state.term) !== state.term.string &&
                                <Button onClick={() => this.saveTerm(state.term)} color="secondary">
                                    Save
                            </Button>
                            }

                        </DialogActions>
                    </Dialog>}
            </Box>
        );
    }
}

export default withStyles(styles)(TermDrawer);
