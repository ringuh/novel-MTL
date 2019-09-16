import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import ChapterList from './chapter_list'
import Button from '@material-ui/core/Button';
//import ReactCrop from 'react-image-crop';
import { withStyles } from '@material-ui/core/styles';
import 'react-image-crop/dist/ReactCrop.css';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
//import GetAppIcon from '@material-ui/icons/GetAppOutlined'
import { Grid, Paper, Box, Container } from '@material-ui/core';



const styles = {
    transparentBar: {
      backgroundColor: 'transparent !important',
      boxShadow: 'none',
      paddingTop: '25px',
      color: '#FFFFFF'
    },
    avatar: {
        display: "block",
        maxWidth:"100%",
        maxHeight:"100%",
        width: "auto",
        height: "auto",
    }
  };


class NovelEditor extends Component {
    constructor(props) {
        super(props);
        console.log("novel editor", props)
        this.state = {
            id: props.match.params.id,
            novel: {
                name: "",
                description: "",
            },

        };

        this.formChange = this.formChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    fields = [
        {
            name: "name",
            label: "Name of the novel",
            type: "text"
        },
        {
            name: "raw_url",
            label: "Novel raw url",
            type: "url",
            placeholder: "eg. https://www.lewenxiaoshuo.com/books/gandiehenaxieganerzi/"
        },
        {
            name: "description",
            label: "Description",
            type: "text",
            multi: true
        },

    ]



    formChange(e) {
        this.setState({
            novel: { ...this.state.novel, ...{ [e.target.name]: e.target.value } },
            //message: null,
            //error: false 
        })


    }

    handleSubmit(event) {

        console.log(event, this.state)

        var subm = async () => {
            this.setState({ progress: true })
            let res = await axios.post(`/api/novel/${this.state.id}`, this.state.novel);

            console.log(res.data)
            console.log(res.data.error || res.data.message)

            if (res.data.id) {
                setTimeout(() => this.setState({
                    novel: res.data,
                    progress: false,
                    edit: false
                }), 1000)
            }

        };

        subm();

        event.preventDefault();
    }

    componentDidMount() {
        if (!this.state.id) return false
        document.title = "Fetching novel"

        fetch(`/api/novel/${this.state.id}`)
            .then(response => response.json())
            .then(data => this.setState({
                novel: data,
                edit: data.raw_url ? false : true
            }));

    }

    componentDidUpdate() {
        document.title = this.state.edit ? `Editing ${this.state.novel.name}` : `Novel ${this.state.novel.name}`
    }



    render() {
        const { classes } = this.props;

        if (this.state.redirect) {
            return <Redirect to={`./${this.state.redirect}`} />
        }

        if (!this.state.novel.name)
            return (
                <LinearProgress color="secondary" />
            )


        // the edit view
        return (
            <Container>
                <Paper>
                    <Box component="form" p={2}
                        onSubmit={this.handleSubmit}
                        autoComplete="off" >
                        <Grid container>
                            <Grid item xs={2}>
                                <img className={classes.avatar} 
                                    alt={this.state.novel.name}
                                    src={this.state.novel.image_url} />
                            </Grid>
                            <Grid container item xs={9}>
                                {this.fields.map((field) =>
                                    <Grid item xs={12} key={field.name} >
                                        <TextField
                                            autoComplete="off"
                                            variant="outlined"
                                            name={field.name}
                                            multiline={field.multi ? true : false}
                                            rows={field.multi ? "5" : ""}
                                            rowsMax={field.multi ? "20" : ""}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            label={field.label}
                                            value={this.state.novel[field.name] || ""}
                                            onChange={this.formChange}
                                            margin="normal"
                                            disabled={this.state.progress || !this.state.edit}
                                            fullWidth
                                        ></TextField>
                                    </Grid>
                                )}
                                <Grid container item xs={10}>
                                    {(() => {
                                        if (this.state.progress)
                                            return (<Grid item xs><CircularProgress color="secondary" /></Grid>)
                                        else if (this.state.edit)
                                            return (
                                                <Grid container>
                                                    <Grid item xs>
                                                        <Button type="submit">
                                                            <SaveIcon fontSize="inherit" />
                                                            Save
                                                    </Button>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Button onClick={() => this.setState({ edit: false })}
                                                            color="secondary">
                                                            Cancel
                                                    </Button>
                                                    </Grid>
                                                </Grid>
                                            )
                                    })()}
                                </Grid>
                            </Grid>
                            <Grid item xs={1}>
                                <Button onClick={() => this.setState({ edit: !this.state.edit })}
                                    color="secondary">
                                    <EditIcon color="primary" fontSize="large" />
                                </Button>
                            </Grid>
                           
                        </Grid>
                    </Box>
                </Paper>

                {/* <ChapterList novel={this.props.match.params.id}/> */}
                <Route path={this.props.match.path} component={ChapterList}/>
            </Container>
        );
    }
}

export default withStyles(styles)(NovelEditor);