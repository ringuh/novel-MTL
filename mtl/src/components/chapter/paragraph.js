import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { borderTop } from '@material-ui/system';

const styles = {
    raw: {
        padding: '1em',
        color: "var(--red)",
        marginTop: '2em',

        '&:first-child': {
            marginTop: "none"
        }
    },
    proofread: {
        padding: '1em',
        color: "var(--secondary)"
    },
    baidu: {
        padding: '1em',
        color: "var(--cyan)"
    },
    sogou: {
        padding: '1em',
        color: "var(--gray)"
    },
};


class ChapterDrawer extends Component {
    constructor(props) {
        super(props);
        console.log("chapter drawer", props)
        this.state = {
            chapter_id: props.chapter_id,
        };



    }


    componentDidMount() {

    }

    render() {
        const { classes } = this.props;



        return (
            <Grid item xs={12} md={this.props.md}
                className={classes[this.props.paragraph.type]}
            > {this.props.paragraph.row}.
                {this.props.paragraph.content}
            </Grid>
        );
    }
}

export default withStyles(styles)(ChapterDrawer);