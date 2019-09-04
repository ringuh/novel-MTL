import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid, GridList, GridListTile, Paper, Avatar, Link, Box, Container } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ListIcon from '@material-ui/icons/ListOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
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
import ChapterDrawer from './chapter_drawer'

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
    }
};


class ChapterBottomNav extends Component {
    constructor(props) {
        super(props);
        console.log("chapter bottom nav", props)
        this.state = {
            chapter_id: props.chapter_id,
            novel_id: props.novel_id,
            chapters: []
        };

    }




    toggleState = (attr, value) => {
        console.log(attr, value)
        return event => {
            this.setState({ ...this.state, [attr]: value });
        };
    }


    componentDidMount() {
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
                        onClick={this.toggleState('chapterDrawer', true)} />
                    <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
                    <BottomNavigationAction label="Nearby" value="nearby" icon={<FavoriteIcon />} />
                    <BottomNavigationAction icon={<SettingsIcon />}
                        label="Folder"
                        value="folder"
                        onClick={this.toggleState('smth', !this.state.smth)}
                    />

                </BottomNavigation>


                

                <ExpansionPanel expanded={this.state.smth} onChange={true}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography >General settings</Typography>
                        <Typography >I am an expansion panel</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                            maximus est, id dignissim quam.
          </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <Grow className={this.state.smth ? '' : classes.hide} in={this.state.smth}>
                    <List elevation={4}>
                        <ListSubheader>Settings</ListSubheader>
                        <ListItem>
                            <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    //onChange={handleToggle('wifi')}
                                    checked={true}
                                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Grow>

                <ChapterDrawer chapter_id={this.state.id}
                    novel_id={this.state.novel_id}
                    open={this.state.chapterDrawer}
                    toggle={this.toggleState} />
            </Box>
        );
    }
}

export default withStyles(styles)(ChapterBottomNav);