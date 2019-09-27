import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ListIcon from '@material-ui/icons/ListOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import TranslateIcon from '@material-ui/icons/Translate';
import ChapterSettings from './chapter_settings'
import ChapterDrawer from './drawer'
import TermDrawer from './terms'

const styles = theme => ({
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
});


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
        this.setState({[attr]: value});
        
    }

    render() {
        const { classes, parent } = this.props;
        const { state } = this

        return (
            <Box className={classes.bottom}>
                <BottomNavigation value={state.value} onChange={this.handleChange}>
                    <BottomNavigationAction
                        label="Recents"
                        value="recents"
                        icon={<ListIcon />}
                        onClick={() => this.toggleState('chapterDrawer', true)} />
                    {/* <BottomNavigationAction icon={<FavoriteIcon />}
                        label="Favorites"
                        value="favorites" /> */}
                    <BottomNavigationAction icon={<TranslateIcon />}
                        label="Nearby"
                        value="nearby"
                        onClick={() => this.toggleState('term', !this.state.smth)}
                    />
                    <BottomNavigationAction icon={<SettingsIcon />}
                        label="Folder"
                        value="folder"
                        onClick={() => this.toggleState('settings', !this.state.settings)}
                    />
                </BottomNavigation>
                
                <ChapterSettings 
                    open={this.state.settings}
                    parent={this}
                    settings={parent.toggleSettings} 
                    chapter={parent.state} />
                
                <ChapterDrawer parent={this}/>

                <TermDrawer parent={this}
                   /*  novel_id={parent.state.novel_id}
                    translate={parent.translate}
                    toggle={this.toggleState}
                    open={this.state.term}  */
                />

            </Box>
        );
    }
}

export default withStyles(styles)(ChapterBottomNav);