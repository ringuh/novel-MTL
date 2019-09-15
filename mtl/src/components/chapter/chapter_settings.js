import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    grid: {
        //margin: '1em auto'
    },
    row: {
       // margin: '1em auto',
        verticalAlign: 'center',
        '&:first-child': {
            paddingTop: "0.75em",
        },
        '& grid:last-child': {
            paddingTop: "0.75em",
        }
    },
    text: {
        paddingTop: "0.75em !important",
    },
    snackbar: {
        //margin: theme.spacing(1),
        //color: amber[700],

        //backgroundColor: theme.palette.primary.main,
    },
    save: {
        backgroundColor: green[600],
    },
    icon: {
        marginRight: "0.5em"
    }
});


class ChapterSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };



    }



    render() {
        const { classes } = this.props;
        const state = this.state


        return (
            <Box component="div" className={classes.snackbar}>
                <Grid component="label" container 
                    alignItems="center" 
                    className={classes.grid} spacing={1}>
                    <Grid container item spacing={1} xs={12} className={classes.row}>
                        <Grid item xs={5}>Show all</Grid>
                        <Grid item xs={2}>
                            <Switch
                                checked={state.checkedC}
                                onChange={() => 'checkedC'}
                                value="checkedC"
                            />
                        </Grid>
                        <Grid item xs={5}>Swipe between</Grid>
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
            </Box>
        );
    }
}

export default withStyles(styles)(ChapterSettings);