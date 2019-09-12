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
import TermDrawer from './terms'

const styles = {
    link: {
        '&:hover': {
            textDecoration: 'none',
        },
    },
    bottom: {
        position: "sticky",
        bottom: "0px"
    },
    hide: {
        display: "none"
    },
    background: {
        backgroundColor: "red",
    }
};


class ChapterBottomNav extends Component {
    constructor(props) {
        super(props);
        console.log("chapter bottom nav", props)
        this.state = {
            chapter_id: props.chapter_id,
            novel_id: props.novel_id,
            term: false,
            chapters: []
        };

    }




    toggleState = (attr, value) => {
        console.log(attr, value)
        this.state[attr] = value
        this.setState(this.state);
        
    }


    componentDidMount() {
        return true
        fetch(`/novel/${this.state.novel_id}/chapter`)
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
                <BottomNavigation value={this.state.value} onChange={this.handleChange}>
                    <BottomNavigationAction
                        label="Recents"
                        value="recents"
                        icon={<ListIcon />}
                        onClick={() => this.toggleState('chapterDrawer', true)} />
                    <BottomNavigationAction icon={<FavoriteIcon />}
                        label="Favorites"
                        value="favorites" />
                    <BottomNavigationAction icon={<TranslateIcon />}
                        label="Nearby"
                        value="nearby"
                        onClick={() => this.toggleState('term', !this.state.smth)}
                    />
                    <BottomNavigationAction icon={<SettingsIcon />}
                        label="Folder"
                        value="folder"
                        onClick={() => this.toggleState('smth', !this.state.smth)}
                    />
                </BottomNavigation>

                
                
                <ChapterDrawer chapter_id={this.state.id}
                    novel_id={this.state.novel_id}
                    open={this.state.chapterDrawer}
                    toggle={this.toggleState} />

                <TermDrawer novel_id={this.state.novel_id}
                    translate={this.props.translate}
                    paragraphs={this.state.paragraphs}
                    toggle={this.toggleState}
                    open={this.state.term} />

            </Box>
        );
    }
}

export default withStyles(styles)(ChapterBottomNav);