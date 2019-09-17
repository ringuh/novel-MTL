import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
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
        this.state = {
            chapter_id: props.chapter_id,
            novel_id: props.novel_id,
            chapters: []
        };

        

    }


    componentDidMount() {
        fetch(`/api/novel/${this.state.novel_id}/chapter`)
            .then(response => response.json())
            .then(data => this.setState({ ...this.state, chapters: data }))
            .then(st => console.log(this.state))



    }

    render() {
        const { classes } = this.props;

        if(this.props.open == null)
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
                            {`Novel name?`}
                        </ListSubheader>
                        <Link component="li"
                            underline="none"
                            href={`/novel/${this.props.novel_id}`}>
                            <ListItem button key={"index"}
                                dense={true}
                                divider={true}>
                                <ListItemText
                                    primary={"Novel index"}
                                    secondary={`really`} />
                            </ListItem>
                        </Link>

                        {this.state.chapters.map((val, indx) => {
                            return <Link component="a" 
                                className={classes.link}
                                href={val.id}>
                                <ListItem button key={val.id}
                                    dense={true}
                                    divider={true}
                                    autoFocus={val.id === this.state.chapter_id}
                                    selected={val.id === this.state.chapter_id}>
                                    <ListItemText
                                        primary={val.id === this.state.chapter_id ? "hei" : "ei"}
                                        secondary={`${val.order} ${val.url}`} />
                                </ListItem>
                            </Link>
                        })}

                    </List>
                    <Divider />

                </div>
            </SwipeableDrawer>
        );
    }
}

export default withStyles(styles)(ChapterDrawer);