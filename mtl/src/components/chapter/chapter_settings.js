import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';


const styles = theme => ({
    root: {
        minHeight: "300px",
        maxHeight: "80%",
        margin: "1em auto",
        width: "90%",
    }
});


class ChapterSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };



    }



    render() {
        const { classes, settings, chapter, parent } = this.props;
        const { state, props } = this


        return (

            <SwipeableDrawer
                anchor="bottom"
                open={props.open || false}
                onClose={() => parent.toggleState('settings', false)}
                onOpen={() => parent.toggleState('settings', true)}
            >
                <Grid component="label" container
                    alignItems="center"
                    className={classes.root} spacing={1}>
                    <Grid container item spacing={1} xs={12} className={classes.row}>
                        <Grid item xs={5}>Show all</Grid>
                        <Grid item xs={2}>
                            <Switch
                                checked={chapter.swipeMode ? true : false}
                                onChange={() => settings('swipeMode', !chapter.swipeMode)}
                                value={chapter.swipeMode}
                            />
                        </Grid>
                        <Grid item xs={5}>Swipe between</Grid>
                    </Grid>

                    <Grid container item spacing={1} xs={12}>
                        <Grid item xs={5}></Grid>
                        <Grid item xs={2}>
                            <Switch
                                checked={chapter.raw.hide ? false : true}
                                onChange={() => settings('hideRaw', !chapter.raw.hide)}
                                value={!chapter.raw.hide}
                            />
                        </Grid>
                        <Grid item xs={5}>Show RAW</Grid>
                    </Grid>
                    <Grid container item spacing={1} xs={12}>
                        <Grid item xs={5}></Grid>
                        <Grid item xs={2}>
                            <Switch
                                checked={state.checkedD}
                                onChange={() => 'checkedD'}
                                value="checkedD"
                            />
                        </Grid>
                        <Grid item xs={5}>Autosave as proofread</Grid>
                    </Grid>
                </Grid>
            </SwipeableDrawer>

        );
    }
}

export default withStyles(styles)(ChapterSettings);