import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
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
        const { classes, parent } = this.props;
        const chapter = parent.props.parent.state

        return (
            <Drawer
                open={parent.state.chapterDrawer}
                onClose={() => parent.toggleState('chapterDrawer', false)}
            //onOpen={() => this.props.toggle('chapterDrawer', true)}
            >
                <List className={classes.list}>
                    <ListSubheader
                        className={classes.subheader}>
                        {`${chapter.chapters.length} chapters`}
                    </ListSubheader>

                    {chapter.chapters.map((val, indx) => {
                        return <ListItem button key={val.id}
                            component={Link}
                            to={`${val.order}`}
                            dense={true}
                            divider={true}
                            autoFocus={val.id === chapter.id}
                            selected={val.id === chapter.id}>
                                <ListItemText
                                    primary={`Chapter ${val.order}`}
                                    secondary={val.title} />
                        </ListItem>
                    })}
                </List>
            </Drawer >
        );
    }
}

export default withStyles(styles)(ChapterDrawer);