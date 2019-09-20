import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {
    Box, Container, Button,
    Typography, TextField,
    List, ListItem, Divider, ListItemText
} from '@material-ui/core'
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined';
import ProgressBar from '../util/ProgressBar'
import { green } from '@material-ui/core/colors'



const styles = theme => ({
    form: {
        width: "100%",
        maxWidth: "600px",
        margin: "auto"
    },
    textField: {
        width: "100%"
    },
});


class NovelChapters extends Component {
    constructor(props) {
        super(props);
        console.log("chapter list", props)
        this.state = {
            id: props.novel.id,
            wsFeed: []
        };


        this.handleSubmit = this.handleSubmit.bind(this);

    }

    generateTranslateString() {
        let str = {
            url: `${global.config.server.api}/novel/${this.state.id}/chapter`,
            limit: 50
        }
        this.setState({ translateString: JSON.stringify(str) })
    }

    handleSubmit(chapter_id, limit, overwrite) {

        if (this.connection.readyState > 1) {
            this.initWS()

            setTimeout(() => this.handleSubmit(chapter_id, limit, overwrite), 2000);
            return true
        }

        this.connection.send(JSON.stringify({
            cmd: "scrape",
            novel_id: this.state.id,
            chapter_id: chapter_id,
            limit: limit,
            overwrite: overwrite
        }))

    }

    writeConsole(line) {
        this.setState({ wsFeed: [line.toString(), ...this.state.wsFeed] })

    }

    initWS() {
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        this.connection = new WebSocket(global.config.server.websocket);
        this.connection.onopen = () => {
            // connection is opened and ready to use
            this.writeConsole("Websocket ready")
        };

        this.connection.onerror = (error) => console.log("WS", error)

        this.connection.onmessage = (message) => {
            try {
                var json = JSON.parse(message.data);

                this.writeConsole(json.msg)

                if (json.command === "reload_chapters")
                    this.props.fetchChapters()

            } catch (e) {
                console.log(e)
                return;
            }
            // handle incoming message
        };
    }

    fetchChapters() {
        return true
        fetch(`/api/novel/${this.state.id}/chapter?content_length=paragraphs`)
            .then(response => response.json())
            .then(data => { console.log(data); return data })
            .then(data => this.setState({
                chapters: data,
                chapter_id: data.length > 0 ? data[data.length - 1].id : this.state.chapter_id
            }))//.then(()=> console.log(this.state.chapters))
    }

    componentDidMount() {
        this.props.fetchChapters()
        this.generateTranslateString()

        this.initWS()

    }

    componentDidUpdate() {
        //document.title = this.state.edit ? `Editing ${this.state.novel.name}` : `Novel ${this.state.novel.name}`
    }



    render() {

        const { classes, novel } = this.props

        if (!novel.chapters)
            return (<ProgressBar color={green[600]} margin='1em 0' />)

        return (
            <Container>
                <Box m={2}>
                    <Button xs={4}
                        color="primary"
                        size="medium"
                        onClick={() => this.handleSubmit(-1)}>
                        <CloudDownloadIcon color="secondary" />
                        <Box ml={1}>
                            {(novel.chapters.length === 0) ?
                                ("Initialize from RAW directory") :
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

                <Box m={2}>
                    <TextField multiline fullWidth
                        onClick={() => { navigator.clipboard.writeText(this.state.translateString); 
                            alert(`Copied to clipboard: ${this.state.translateString}`)}}
                        label="Console"
                        variant="outlined"
                        rows={2}
                        value={this.state.translateString} />
                </Box>

                {novel.chapters && novel.chapters.length > 0 &&
                    <Box>
                        <List>
                            {novel.chapters.map((chapter) => (
                                <Link to={`/novel/${novel.alias}/chapter/${chapter.order}`} key={chapter.id}>
                                    <ListItem alignItems="flex-start" >

                                        <ListItemText component="a" href="/novel"
                                            primary={`${chapter.order}. ${chapter.title}`}
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
                                                    {chapter.url}
                                                </React.Fragment>
                                            }
                                        />
                                        <ListItemText
                                            secondary={
                                                [chapter.raw || 'missing',
                                                chapter.sogou || 'sogou',
                                                chapter.baidu || 'baidu',
                                                chapter.proofread || 'tbd',
                                                ].join(" / ")

                                            }>
                                        </ListItemText>


                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </Link>
                            ))}


                        </List>
                    </Box>}
                <Typography variant="h5">
                    {JSON.stringify(novel.chapters)}
                </Typography>
            </Container>

        );
    }
}

export default withStyles(styles)(NovelChapters);