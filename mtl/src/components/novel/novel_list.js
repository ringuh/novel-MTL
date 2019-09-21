import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        "& a": {
            color: "var(--pink)",
        },
        "& a:hover": {
            textDecoration: "none",
        }
    },
    paragraphs: {
        textAlign: 'left'
    },

    bottom: {
        position: "sticky",
        bottom: "0px"

    },

    chapterNav: {
        margin: "2em auto"
    }
});



class NovelList extends Component {
    constructor(props) {
        super(props);
        console.log("Novel list", props)
        this.state = {
            novels: null,
        };


    }

    componentDidMount() {
        fetch('/api/novel')
            .then(response => response.json())
            .then(data => { console.log("novels", data); return data})
            .then(data => this.setState({ novels: data }));
    }


    render() {
        const { classes } = this.props
        const state = this.state

        if (!state.novels)
            return (<LinearProgress color="secondary" />)

        return (
            <div>
                <h2>Novel listing</h2>

                <List className={classes.root}>
                {state.novels.map((novel) => (
                    <ListItem component={Link} key={novel.id} 
                        to={`/novel/${novel.alias}`} 
                        divider
                        alignItems="flex-start" >
                        <ListItemAvatar>
                            <Avatar alt={novel.name} src={novel.image_url} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={novel.name}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className=""
                                        color="textSecondary"
                                    >
                                        {novel.description ? novel.description.substr(0, 400): "description missing"}
                                        {novel.description && novel.description.length > 400 ? '...': null}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                        
                    </ListItem>
                    
                
                 ))}
                    
               
                </List>

            </div>
        )
    }
}

export default withStyles(styles)(NovelList);