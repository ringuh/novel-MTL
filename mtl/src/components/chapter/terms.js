import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid, GridList, GridListTile, Button, Avatar, Link, Box, Container } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ListIcon from '@material-ui/icons/ListOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import TranslateIcon from '@material-ui/icons/Translate';
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import ListSubheader from '@material-ui/core/ListSubheader';
import ChapterDrawer from './drawer'


const styles = {
    link: {
        '&:hover': {
            textDecoration: 'none',
        },
    },

};


class TermDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }




    toggleState = (attr, value) => {
        console.log(attr, value)
        this.setState({ [attr]: value });
    }


    componentDidMount() {
        fetch(`/novel/${this.state.novel_id}/terms`)
            .then(response => response.json())
            .then(data => this.setState({ ...this.state, chapters: data }))
            .then(st => console.log(this.state))



    }

    componentDidUpdate() {

    }

    render() {
        const { classes } = this.props;

        return (
            <Box className={classes.bottom}>


            </Box>
        );
    }
}

export default withStyles(styles)(TermDrawer);
/*

<Dialog open={this.state.term} onClose={this.toggleState} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add a new term</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You can add a new <strong>english</strong> term to
                            replace some of the words used in machine translation.
                            Terms do not effect saved <strong>raw</strong> or <strong>proofread</strong> text
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Term to translate"
                            placeholder="eg. tribulation"
                            type="text"
                            fullWidth
                        />
                        <Divider />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Translation"
                            placeholder="eg. kill | dont kill"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleState} color="primary">
                            Cancel
          </Button>
                        <Button onClick={this.toggleState} color="primary">
                            Add
          </Button>
                    </DialogActions>
                </Dialog>
                */