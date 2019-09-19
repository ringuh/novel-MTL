import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import SpellcheckIcon from '@material-ui/icons/SpellcheckRounded';
import EditIcon from '@material-ui/icons/EditOutlined';
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';


const styles = theme => ({
    root: {
        minHeight: "300px",
        maxHeight: "80%",
        margin: "1em auto",
        width: "90%",
    },
    row: {
        // marginBottom: "1em"
    },
    right: {
        float: "right"
    },
    toggleButton: {
        width: "100%",
        display: "flex",
        "& button": {
            /* color: "#f50057",
            border: "1px solid #f50057", */
            flex: 1
        },
        "& .Mui-selected": {
            /*  color: "#fff",
             backgroundColor: "#f50057 !important" */
            color: "#f50057",
            border: "1px solid #f50057",
        }

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
                    className={classes.root}>
                    <Grid container item xs={12} className={classes.row}>
                        <Button className={classes.right}>Settings</Button>
                    </Grid>
                    <Grid container item xs={12} className={classes.row}>
                        <ToggleButtonGroup exclusive
                            className={classes.toggleButton}
                            value={chapter.swipeMode}
                            size="small">
                            <ToggleButton
                                onClick={() => settings('swipeMode', false)}
                                value={false}
                            >Show all</ToggleButton>
                            <ToggleButton
                                onClick={() => settings('swipeMode', true)}
                                value={true}
                            >Swipe mode</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    {chapter.swipeMode &&
                        <Grid container item xs={12} className={classes.row}>
                            <Button fullWidth
                                variant="outlined"
                                onClick={() => { settings('priority', !chapter.priority) }}
                            >
                                {chapter.priority ? 'Baidu > Sogou' : 'Sogou > Baidu'} (reload required)
                        </Button>
                        </Grid>
                    }

                    <Grid container item xs={12} className={classes.row}>
                        <ToggleButtonGroup exclusive
                            size="small"
                            className={classes.toggleButton}
                            value={chapter.raw.hide} >
                            <ToggleButton
                                onClick={() => settings('hideRaw', true)}
                                value={true}
                            >Hide RAW</ToggleButton>
                            <ToggleButton
                                onClick={() => settings('hideRaw', false)}
                                value={false}
                            >Show Raw</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    <Grid container item xs={12} className={classes.row}>
                        <Button fullWidth
                            variant="outlined"
                            onClick={() => parent.props.parent.setState({ edit: 'edit' })}
                            value={true}
                        >
                            <EditIcon fontSize="small" /> 
                        Edit chapter </Button>

                    </Grid>



                    <Grid container item xs={5}>Autosave as proofread</Grid>

                </Grid>
            </SwipeableDrawer>

        );
    }
}

export default withStyles(styles)(ChapterSettings);