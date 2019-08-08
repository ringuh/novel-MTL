import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class NovelEditor extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            id: props.match.params.id || null,
            name: null,
            alias: null,
            image_url: null,
            raw_directory: null,
            raw_url: null,
            description: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }

    handleChange(event) {
        //console.log(event.target)
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        console.log(this.state)
    }

    handleSubmit(event) {

        console.log(event, this.state)
        console.log('An essay was submitted: ' + this.state.foo);
        
        var subm = async () => { 
            let res = await axios.post('/novel/edit', this.state);
            
            console.log(res)
            console.log(res.data.error || res.data.message)

            if(res.data.id){
                setTimeout(() => this.setState({redirect: res.data.id}), 1000)
            }

        };

        subm();

        event.preventDefault();
    }

    componentDidMount() {
        if(!this.state.id) return false

        console.log("lets fetch")
        fetch('/novel/'+this.state.id)
            .then(response => response.json())
            .then(data => this.setState(data));
        
    }

    testi() {
        this.setState({
            value: "changed content"
        })

        fetch('/novel'
                /*, {
                      headers : { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                       }

                    }*/
            )
            .then(response => response.json())
            .then(data => console.log({ data }));


    }

    render() {

        if(this.state.redirect){
            return <Redirect to={`./${this.state.redirect}`} />
        }

        if(this.state.id){
            return (
            <div>
                <h1><em>{this.state.id}</em></h1>
                <h3>{this.state.name}</h3>
            
            </div>)
        }

        return (
            <form onSubmit={this.handleSubmit}>
            <h4>{this.props.match.path}</h4>
            <input type="text" name="name" placeholder="Novel name" required 
                onChange={this.handleChange} /><br/>
            <input type="url"  name="raw_directory" placeholder="Raw directory" 
                onChange={this.handleChange} /><br/>
            <input type="url"  name="raw_url" placeholder="First raw chapter" 
                onChange={this.handleChange}/><br/>
            <textarea name="description" placeholder="Novel description" 
                onChange={this.handleChange}></textarea><br/>
            

            <input type="submit" value="Send"/>


            <br/><br/>
            
            <br/>
             <Link to={`${this.props.match.path}/2`} >{this.props.match.path}/2</Link>
                

            </form>


        );
    }
}

export default NovelEditor;