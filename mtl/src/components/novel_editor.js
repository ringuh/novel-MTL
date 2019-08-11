import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';



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
            edit: true
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
            name: "description",
            label: "Description",
            type: "text",
            multi: true
        },
        {
            name: "raw_directory",
            label: "Novel raw url",
            type: "url",
            placeholder: "eg. https://www.lewenxiaoshuo.com/books/gandiehenaxieganerzi/"
        },
        {
            name: "raw_url",
            label: "Url of first RAW chapter",
            type: "url",
            placeholder: "eg. https://www.lewenxiaoshuo.com/books/gandiehenaxieganerzi/6461352.html"
        }
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
            let res = await axios.post(`/novel/${this.state.id}`, this.state.novel);

            console.log(res.data)
            console.log(res.data.error || res.data.message)

            if (res.data._id) {
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
        console.log("y")
        fetch(`/novel/${this.state.id}`)
            .then(response => response.json())
            .then(data => this.setState({ novel: data }));

    }

    componentDidUpdate() {
        document.title = this.state.edit ? `Editing ${this.state.novel.name}` : `Novel ${this.state.novel.name}`
    }





    render() {


        if (this.state.redirect) {
            return <Redirect to={`./${this.state.redirect}`} />
        }

        if (!this.state.novel.name)
            return (
                <LinearProgress color="secondary" />
            )


        if (!this.state.edit) {
            return (
                <div>
                    <title>Edit this</title>
                    <Button color="primary" onClick={() => this.setState({ edit: true })}>
                        Edit
                    </Button>
                    <h1><em>{this.state.id}</em></h1>
                    <h3>{this.state.name}</h3>

                </div>)
        }



        return (
            <form
                onSubmit={this.handleSubmit}
                autoComplete="off">

                {this.fields.map((field) =>
                    <TextField
                        autoComplete="off"
                        key={field.name}
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
                        //helperText={this.state.novel[field.name].message || ""}
                        //error={this.state.}
                        margin="normal"
                        disabled={this.state.progress}
                        fullWidth
                    ></TextField>
                )}
                {(() => {
                    if (this.state.progress) 
                        return (<CircularProgress color="secondary" />)
                    else
                        return(<Button type="submit">
                            <SaveIcon fontSize="inherit" />
                            Save
                        </Button>)
                })()}


            </form>


        );
    }
}

export default NovelEditor;