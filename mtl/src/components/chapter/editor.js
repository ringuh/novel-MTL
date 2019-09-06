import React, { Component } from 'react';
//import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
/* import ChapterList from './chapter_list'
import Button from '@material-ui/core/Button';
import ReactCrop from 'react-image-crop'; */
import { withStyles } from '@material-ui/core/styles';
import 'react-image-crop/dist/ReactCrop.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid, GridList, GridListTile, Paper, Avatar, Link, Box, Container } from '@material-ui/core';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChapterBottomNav from './bottom_nav'
import Paragraph from './paragraph'


const styles = {
    
    para: {
        marginBottom: '1em'
    },

    bottom: {
        position: "sticky",
        bottom: "0px"

    }

};


class ChapterEditor extends Component {
    constructor(props) {
        super(props);
        console.log("chapter editor", props)
        this.state = {
            id: props.match.params.chapter_id,
            novel_id: props.match.params.novel_id,
        };

        this.formChange = this.formChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }





    formChange(e) {
        this.setState({
            novel: { ...this.state.novel, ...{ [e.target.name]: e.target.value } },
            //message: null,
            //error: false 
        })


    }

    handleSubmit(event) {



        event.preventDefault();
    }

    componentDidMount() {
        if (!this.state.id) return false
        fetch(`${this.props.match.url}`)
            .then(response => response.json())
            .then(data => this.editParagraphs(data))
            //.then(data => this.setState(data))
            .then(st => console.log(this.state))



    }

    componentDidUpdate() {
        document.title = `set title fucksake`
    }

    editParagraphs(json) {
        let max_paragraphs = 0

        const paragraphs = ['raw', 'proofread', 'baidu', 'sogou',].map(key => {
            if (!json[key])
                return { type: key, paragraphs: [] }
            //do smth 

            // get the content
            let ps = json[key].content.replace(/\n{2,}/g, '\n');
            ps = ps.split('\n')
            ps = ps.filter(el => el.trim() !== '')
            // split content into paragraphs and remove double-spaces and empty parts

            // record the max number of paragraphs
            max_paragraphs = ps.length > max_paragraphs ? ps.length : max_paragraphs;

            return { type: key, paragraphs: ps }
        })
        json.paragraphs = []
        for (var i = 0; i < max_paragraphs; ++i)
            paragraphs.forEach((translation, index) => {
                let p = {
                    type: translation.type,
                    content: translation.paragraphs[i] || null,
                    row: i
                }



                json.paragraphs.push(p)
               
            })

        console.log(json)

        this.setState(json)

    }




    render() {
        const { classes } = this.props;
        /* if (this.state.redirect) {
            return <Redirect to={`./${this.state.redirect}`} />
        } */

        if (!this.state.createdAt)
            return (
                <LinearProgress color="secondary" />
            )

        const gridSize = 12 / 4;

        return (
            <Container>
                <h1>THIS IS CHAPTER EDITOR</h1>
                <a href={`${this.state.id - 1}`}>prev</a> -- <a href={`${this.state.id + 1}`}>next</a>

                <Grid container spacing="{3}">
                    {this.state.paragraphs.map((p, index) => {
                        return <Paragraph key={index}
                        md={gridSize}
                        paragraph={p}
                    ></Paragraph>
                    })}
                </Grid> */}



                {/* <Grid container spacing="{3}">
                    {this.state.paragraphs[0].map((value, index) => {
                        return this.state.paragraphs.map((val, i) => {
                            return <Grid className={classes[`col${i}`]+` warning`}
                                item xs={12} md={gridColumns}
                            >
                                {val[index]}
                            </Grid>
                        })
                        for (var i = 0; ++i; i < this.state.paragraphs.length)
                            return
                    })}
                </Grid> */}
                <ChapterBottomNav
                    novel_id={this.state.novel_id}
                    chapter_id={this.state.id} />
            </Container>



        );
    }
}

export default withStyles(styles)(ChapterEditor);