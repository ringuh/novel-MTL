import React from 'react';
import GoogleLogin from 'react-google-login';




class Login extends React.Component {
    responseGoogle = (response) => {
        console.log("this is google login attempt")
        console.log(response);
        //console.log(global.ServerConf.googleOAUTH)
    }

    render() {
        if(true)
        return <div></div>
        return (
            <GoogleLogin
                clientId={global.ServerConf.googleOAUTH}
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
              /*   hei mummo mitä kuuluu
                </GoogleLogin> */
        )
    }
}

export default Login;