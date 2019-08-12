import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {
    Box, Container, Grid, List, Button,
    Paper, Typography, TextField, ButtonGroup
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
        console.log("novel editor", props)
        this.state = {
            id: props.novel,
            chapterId: -1,
            edit: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(e) {
        console.log(e.target.value)
        this.setState({ chapterId: e.target.value })


    }

    handleSubmit(event) {

        console.log(event, this.state)

        var subm = async () => {
            
            this.setState({ progress: true })
            let res = await axios.post(`/novel/${this.state.id}/chapters`, 
                { chapterId: this.state.chapterId });

            console.log(res.data)
            console.log(res.data.error || res.data.message)

            if (res.data._id) {
                /* setTimeout(() => this.setState({
                    novel: res.data,
                    progress: false,
                    edit: false
                }), 1000) */
            }

        };

        subm();

        event.preventDefault();
    }

    componentDidMount() {
        fetch(`/novel/${this.state.id}/chapters`, {chapter: this.state.chapterId})
            .then(response => response.json())
            .then(data => this.setState({
                chapters: data
            }));
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
                <h3>chapterlist</h3>
                <Box component="form">
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
                                <option value={-1}>
                                    Initialize from RAW directory
                        </option>
                                {[{ value: 1, label: 'A' }].map(option => (
                                    <option key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Button>
                        <Button xs={4}
                            color="primary"
                            size="small"
                            onClick={this.handleSubmit}>
                            <CloudDownloadIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
                <Typography variant="h5">
                    {JSON.stringify(this.state.chapters)}
                </Typography>
            </Container>

        );
    }
}

export default withStyles(styles)(ChapterList);