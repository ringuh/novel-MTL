import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

class NovelList extends Component {
    constructor(props) {
        super(props);
        console.log("Novel list", props)
        this.state = {
            novels: null,
        };

        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);


    }

    componentDidMount() {
        //console.log(this.props.match.url, this.props.location.pathname)
        // dont fetch if not on main page

        /* if (this.props.match.url != this.props.location.pathname)
            return true */
        fetch('/novel')
            .then(response => response.json())
            .then(data => this.setState({ novels: data }));

    }


    render() {
        if (!this.state.novels)
            return (<LinearProgress color="secondary" />)

        return (
            <div>
                <h2>Novel listing</h2>
                <ul>
                    {this.state.novels.map(({ name, id }) => (
                        <li key={id}>
                            <Link to={`${this.props.match.path}/${id}`}>{name}</Link>
                        </li>
                    ))}
                </ul>
                <div>{JSON.stringify(this.state.novels)}</div>

                <List className="">
                {this.state.novels.map((novel) => (
                    <a href={`${this.props.match.path}/${novel.id}`} key={novel.id}>
                    <ListItem alignItems="flex-start" >
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
                                        color="textPrimary"
                                    >
                                        {novel.description}
                                    </Typography>
                                    {" — I'll be in your neighborhood doing errands this…"}
                                </React.Fragment>
                            }
                        />
                        
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    </a>
                 ))}
                    
               
                </List>

            </div>
        )
    }
}

export default NovelList;