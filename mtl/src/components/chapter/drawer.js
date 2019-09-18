import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
    list: {
        width: "300px",
        overflowX: "hidden"
    },
    subheader: {
        backgroundColor: "white"
    },
    link: {
        '&:hover': {
            textDecoration: 'none',
        },
    }
});


class ChapterDrawer extends Component {
    constructor(props) {
        super(props);
        console.log("chapter drawer", props)
        this.state = {};



    }


    componentDidMount() {
    }

    render() {
        const { classes } = this.props;

        if (this.props.open == null)
            return null

        return (
            <SwipeableDrawer
                open={this.props.open}
                onClose={() => this.props.toggle('chapterDrawer', false)}
                onOpen={() => this.props.toggle('chapterDrawer', true)}
            >
                <div
                    className={classes.list}
                    role="presentation">
                    <List>
                        <ListSubheader
                            className={classes.subheader}>
                            {`${this.props.chapters.length} chapters`}
                        </ListSubheader>

                        {this.props.chapters.map((val, indx) => {
                            return <ListItem button
                                key={val.id}
                                component={Link}
                                to={`${val.order}`}
                                dense={true}
                                divider={true}
                                autoFocus={val.id === this.props.chapter_id}
                                selected={val.id === this.props.chapter_id}>
                                <ListItemText
                                    primary={`Chapter ${val.order}`}
                                    secondary={val.title} />
                            </ListItem>
                        })}

                    </List>
                    <Divider />

                </div>
            </SwipeableDrawer>
        );
    }
}

export default withStyles(styles)(ChapterDrawer);