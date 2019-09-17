import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import NovelCreate from './novel/novel_create';
import Snacky from './chapter/chapter_snackbar'
import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({

    paragraphs: {
        textAlign: 'left'
    },
});

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };

        //this.handleChange = this.handleChange.bind(this);

    }

    render() {
        if (this.state.id) {
            return <Redirect to={'/novel/'+this.state.id} />
        }


        return (
            <div>
                <NovelCreate />
                
                <hr />this is frontpage 
                <Link to="/novel" >Novels</Link>
                <Snacky />
            </div>
        )
    }
}


export default MainPage;