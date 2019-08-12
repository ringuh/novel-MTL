import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios'




class Login extends React.Component {

    
    

    responseGoogle = (response) => {
        console.log("this is google login attempt")
        console.log(response);
        //console.log(global.ServerConf.googleOAUTH)

        const Authenticate = async (google) => {
            this.setState({progress: true})
            let res = await axios.post('./auth', {smth: "smth"});
            console.log("response from /login")
            console.log(res.data)
           
    
        };

        Authenticate(response)
    }

    componentDidMount() {
       
    }

    render() {
        
        return (
            <GoogleLogin
                clientId={global.ServerConf.google_oauth_id}
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        )
    }
}

export default Login;