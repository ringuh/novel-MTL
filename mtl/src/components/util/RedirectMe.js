import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'



class RedirectMe extends Component {


    render() {
        
        const { state, attr='redirect' } = this.props
        const to = state[attr]
        state[attr] = null
        return <Redirect to={to} />
    }
}

export default RedirectMe