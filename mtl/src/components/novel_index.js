import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import NovelEditor from './novel_editor'

class NovelIndex extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            novels: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('An essay was submitted: ' + this.state.foo);
        event.preventDefault();
    }

    componentDidMount() {
        console.log(this.props.match.url, this.props.location.pathname)
        if(this.props.match.url != this.props.location.pathname)
            return console.log("dont fetch")
        fetch('/novel')
        .then(response => response.json())
        .then(data => this.setState({ novels: data }));
        
    }

    testi(){
        this.setState(
        {
            value: "changed content"
        })

        fetch('/novel'/*, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }

    }*/)
        .then(response => response.json())
        .then(data => console.log({ data }));
         
        
    }

    render() {
        return (
<div>
<h2> novellisivut {this.props.match.path} </h2>
    
    <Switch>
        <Route path={`${this.props.match.path}/add`} component={NovelEditor} />
        <Route path={`${this.props.match.path}/:id`} component={NovelEditor} />
    </Switch>
    
    <Route exact path={this.props.match.path}
        render={() => <div>
            <Link className="hei" to={`${this.props.match.path}/add`} >New novel</Link>
            <h2>Novel listing</h2>
            <ul>
            {this.state.novels.map(({ name, _id }) => (
                <li key={_id}>
                    <Link to={`${this.props.match.path}/${_id}`}>{name}</Link>
                </li>
            ))}
            </ul>
            <div>{JSON.stringify(this.state.novels)}</div>
        </div>
    }

    />

        
    
    



</div>

            
        );
    }
}

export default NovelIndex;