import React, { Component } from 'react';
//import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
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
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Popper from '@material-ui/core/Popper'
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



    matches = "matches"

    formChange(e) {
        this.setState({
            novel: { ...this.state.novel, ...{ [e.target.name]: e.target.value } },
            //message: null,
            //error: false 
        })


    }

    stateThis(attr, value) {

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
        console.log(json)

        /*  check the content of all 4 possible translations and split them by paragraph 
            calculate the maximum number of paragraphs as we wanna show all nth-paragraphs at same place 
        */
        const paragraphs = ['raw', 'baidu', 'sogou', 'proofread'].map(key => {
            if (!json[key]){
                json[key] = { show: false, content: '', title: ''}
                return { type: key, paragraphs: [] }
            }
                
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
                    content: translation.paragraphs[i] || '',
                    row: i
                }



                json.paragraphs.push(p)

            })
        
        json.baidu.show = !json.proofread_id
        json.sogou.show = !json.proofread_id
        json.proofread.show = true

        console.log("chapters state", json)

        this.setState(json)

    }

    selectParagraph = (paragraph, option) => {
        console.log(paragraph, option, this.state.paragraphs)

        let proof = this.state.paragraphs.find(p => p.type === 'proofread' && p.row === paragraph.row)
        proof.content = paragraph.content
        
        
        this.setState({...this.state, paragraphs: this.state.paragraphs})
        console.log(this.state.paragraphs)
    }

    translate = (terms) => {
        console.log("translate", this.state.paragraphs)
        if(!this.state.paragraphs) return false
        console.log("this far");

        ["baidu", "sogou", "proofread"].forEach(t => {
            console.log(t)
            terms.filter(t => !t.prompt).forEach(term => this.state[t].content = this.state[t].content
                .replace(new RegExp(term.from, "gi"), `<strong>${term.to}</strong>`))
            
        })
        this.editParagraphs(this.state)
        
        //this.state.paragraphs[1].content = terms
        //this.forceUpdate()
    }

    promptTranslate = event => {
        console.log(event.currentTarget)
        this.state.anchorEl = event.currentTarget
    }


    render() {
        const { classes } = this.props;
        const { state } = this;


        /* if (this.state.redirect) {
            return <Redirect to={`./${this.state.redirect}`} />
        } */

        if (!this.state.paragraphs)
            return (
                <LinearProgress color="secondary" />
            )
        const views = ['raw', 'proofread', 'sogou', 'baidu'].filter(key => this.state[key].show)
        
        console.log("display", views)
        return (
            <Container type="div">
                <h1>THIS IS CHAPTER EDITOR</h1>
                <a href={`${this.state.id - 1}`}>prev</a> -- <a href={`${this.state.id + 1}`}>next</a>

                <Grid container spacing={3}>
                    {this.state.paragraphs.map((p, index) => {
                        if(index > 17) return ""
                        return <Paragraph key={index}
                                selectParagraph={this.selectParagraph}
                                views={views}
                                paragraph={p}
                        />
                    })}
                </Grid>


                <Box>
                    {['raw', 'baidu', 'sogou', 'proofread'].map(key => 
                        <Button fullWidth key={key}
                        onClick={() => this.setState({ [key]: { show: !this.state[key].show }})}
                        variant={state[key].show ? 'contained' : 'outlined'}
                        >
                        {key}
                    </Button>
                    )}
                </Box>
                
                <Popper id="popper" open={this.state.anchorEl ? true: false} anchorEl={this.state.anchorEl}>
                    <div>The content of the Popper.</div>
                </Popper>

                <ChapterBottomNav
                    novel_id={this.state.novel_id}
                    translate={this.translate}
                    paragraphs={this.state.paragraphs}
                    chapter_id={this.state.id} />
                <textarea onChange={() => console.log("textarea value changed")} value={JSON.stringify(this.state.paragraphs[3])}></textarea>
            </Container>



        );
    }
}

export default withStyles(styles)(ChapterEditor);