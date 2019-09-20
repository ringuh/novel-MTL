import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
//import ReactCrop from 'react-image-crop';
import { withStyles } from '@material-ui/core/styles';
import 'react-image-crop/dist/ReactCrop.css';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
//import GetAppIcon from '@material-ui/icons/GetAppOutlined'
import { Grid, Paper, Box, Container } from '@material-ui/core';



const styles = theme => ({
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
        padding: "1em"
    }
  });


class NovelEditor extends Component {
    constructor(props) {
        super(props);
        console.log("novel editor", props)
        this.state = {...props.novel};

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
           [e.target.name]: e.target.value,
        })


    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(event, this.state)
        this.setState({ progress: true })

        axios.post(`/api/novel/${this.state.id}`, this.state)
        .then(res => {
            if(!res.data.id) throw res.data
        }).catch(err => console.log(err))
        .then(()=> this.props.getNovel())
        .then(() => this.setState({...this.props.novel}))
        .finally(() => this.setState({ progress: false, edit: false }))
    }

    render() {
        const { classes } = this.props;
        const state = this.state

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
                                    alt={state.name}
                                    src={state.image_url} />
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
                                            value={state[field.name] || ""}
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
            </Container>
        );
    }
}

export default withStyles(styles)(NovelEditor);