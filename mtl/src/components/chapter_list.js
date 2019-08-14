import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {
    Box, Container, Grid, Button,
    Paper, Typography, TextField, ButtonGroup,
    List, ListItem, Divider, ListItemText
} from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined';




const styles = {
    form: {
        width: "100%",
        maxWidth: "600px",
        margin: "auto"
    },
    textField: {
        width: "100%"
    },
};


class ChapterList extends Component {
    constructor(props) {
        super(props);
        console.log("chapter list", props)
        this.state = {
            id: props.match.params.id,
            edit: true,
            wsFeed: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(e) {
        console.log(e.target.value)
        this.setState({ chapterId: e.target.value })


    }

    handleSubmit(chapterId, limit, overwrite) {
        console.log(chapterId, this.state)
        console.log(this.connection.readyState)

        if(this.connection.readyState > 1)
        {
            this.initWS()

            setTimeout(()=> this.handleSubmit(chapterId, limit, overwrite), 2000);
            return true
        }

        this.connection.send(JSON.stringify({
            cmd: "scrape",
            novelId: this.state.id,
            chapterId: chapterId,
            limit: limit,
            overwrite: overwrite
        }))
        
    }

    writeConsole(line) {
        this.setState({ wsFeed: [line.toString(), ...this.state.wsFeed] })
        
    }

    initWS() {
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        this.connection = new WebSocket('ws://127.0.0.1:1337');
        this.connection.onopen = () => {
            // connection is opened and ready to use
            console.log("WS connection is open")
            this.writeConsole("Websocket ready")

            this.connection.send(JSON.stringify({ msg: "message to server" }))
        };

        this.connection.onerror = (error) => console.log("WS", error)

        this.connection.onmessage = (message) => {
            try {
                console.log("received message", message)
                
                var json = JSON.parse(message.data);
                console.log(json)
                this.writeConsole(json.msg)

                if(json.command == "reload_chapters")
                    this.fetchChapters()

            } catch (e) {
                console.log(e)
                return;
            }
            // handle incoming message


            console.log(message)
        };
    }

    fetchChapters() {
        fetch(`/novel/${this.state.id}/chapters`, { chapter: this.state.chapterId })
            .then(response => response.json())
            .then(data => this.setState({
                chapters: data,
                chapterId: data.length > 0 ? data[data.length - 1]._id : this.state.chapterId
            }));
    }

    componentDidMount() {
        this.fetchChapters()


        this.initWS()

    }

    componentDidUpdate() {
        //document.title = this.state.edit ? `Editing ${this.state.novel.name}` : `Novel ${this.state.novel.name}`
    }



    render() {
        const { classes } = this.props;

        if (!this.state.chapters)
            return (
                <LinearProgress color="secondary" />
            )


        if (this.state.redirect) {
            return <Redirect to={`./${this.state.redirect}`} />
        }

        return (
            <Container>

                {/* <Box component="form">
                    <ButtonGroup size="small">
                        <Button>
                            <TextField
                                id="outlined-select-currency-native"
                                select
                                label="Download RAW"
                                className={classes.textField}
                                value={this.state.chapterId}
                                onChange={this.handleChange}
                                SelectProps={{
                                    native: true,
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Select which chapter to download from"
                                margin="dense"
                                variant="outlined"
                            >
                                {this.state.chapters.reverse().map(chap => (
                                    <option key={chap._id}
                                        value={chap._id}>
                                        {chap.id}. {chap.url}
                                    </option>
                                ))}
                                <option value={-1}>
                                    Initialize from RAW directory
                                </option>


                            </TextField>
                        </Button>
                        <Button xs={4}
                            color="primary"
                            size="small"
                            onClick={this.handleSubmit}>
                            <CloudDownloadIcon />
                        </Button>
                    </ButtonGroup>
                </Box> */}

                <Box m={2}>
                    <Button xs={4}
                        color="primary"
                        size="medium"
                        onClick={()=> this.handleSubmit(-1)}>
                        <CloudDownloadIcon color="secondary"/>
                        <Box ml={1}>
                        {(this.state.chapters.length === 0) ?
                                ("Initialize from RAW directory"):
                                ("Scrape from the latest chapter")

                        }</Box>
                        
                    </Button>
                </Box>

                <Box m={2}>

                    <TextField multiline fullWidth
                        ref={this.consoleBox}
                        label="Console"
                        variant="outlined"
                        rows={4}
                        value={this.state.wsFeed.join('\n')} />
                </Box>

                <Box>
                    <List className="">
                        {this.state.chapters.map((chapter) => (
                            <a href={`${this.props.match.path}/${chapter._id}`} key={chapter._id}>
                                <ListItem alignItems="flex-start" >
                                    <ListItemText
                                        primary={chapter.url}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className=""
                                                    color="textPrimary"
                                                >
                                                    {chapter.content}
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
                </Box>
                <Typography variant="h5">
                    {JSON.stringify(this.state.chapters)}
                </Typography>
            </Container>

        );
    }
}

export default withStyles(styles)(ChapterList);