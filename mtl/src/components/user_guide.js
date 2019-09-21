import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';




const styles = theme => ({
    paragraph: {
        backgroundColor: 'red'
    },
});




class UserGuide extends Component {
    

    
    componentDidUpdate(n, o) {
        if (this.state.content !== this.props.paragraph.content)
            this.setState({ content: this.props.paragraph.content })
    }

    componentDidMount() {

    }


    render() {
        console.log(this.props)
        const { proofreadParagraph, selectParagraph } = this

        return(
            <h3>SUer guide</h3>
        )
    }
}

export default withStyles(styles)(UserGuide);