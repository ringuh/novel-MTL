import React, { Component } from 'react';
import { lighten, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';




class ProgressBar extends Component {


    render() {
        const { color='#ff6c5c', height=10, border=20, margin="0" } = this.props

        const Bar = withStyles({
            root: {
                height: height,
                backgroundColor: lighten(color, 0.5),
                margin: margin
            },
            bar: {
                borderRadius: border,
                backgroundColor: color
            },
        })(LinearProgress);

        return (<Bar />)
    }
}

export default ProgressBar