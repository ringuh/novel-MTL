import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import axios from 'axios'




class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }



    responseGoogle = (response) => {
        const Authenticate = async (google) => {
            this.setState({ progress: true })
            let res = await axios.post('/api/novel/auth', google);
            if(res.data.jwt) localStorage.setItem("jwt", res.data.jwt)
            window.location.reload();
            //this.setState({redirect: !this.state.redirect})
        };

        Authenticate(response)
    }

    componentDidMount() {

    }

    render() {
       /*  if(this.state.redirect)
            return <Redirect to="/" /> */

        return (
            <GoogleLogin
                clientId={global.config.google_oauth.id}
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        )
    }
}

export default Login;