import React, { Component, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { borderTop } from '@material-ui/system';
import ArrowBackIcon from '@material-ui/icons/ArrowBackSharp';
import Hammer from 'react-hammerjs'
import { useSpring, animated } from 'react-spring'


const styles = {
    paragraph: {
        backgroundColor: 'red'
    },
    raw: {
        padding: '1em',
        color: "var(--red)",
        marginTop: '2em',

        '&:first-child': {
            marginTop: "none"
        }
    },
    proofread: {
        padding: '1em',
        //color: "#4caf50"
        color: "var(--secondary)"
    },
    baidu: {
        padding: '1em',
        color: "var(--cyan)"
    },
    sogou: {
        padding: '1em',
        color: "var(--green)"
    },
    border: {
        border: "1px solid black"
    },
};


const SmallTitle = ({ type, duration = 4000 }) => {
    const props = useSpring({
        config: { duration: duration },
        opacity: 0.0, from: { opacity: 1 },
        color: "var(--danger)",
        textAlign: 'left',
        marginLeft: '1em'
    })
    return (<animated.span style={props}>{type}</animated.span>)
}


class ChapterDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newLine: false,
            ...props.paragraph
        };



    }

    toggleState(attr, value) {
        this.setState({ ...this.state, [attr]: value })
    }


    editParagraph = (event) => {
        event.preventDefault()
        //console.log(event.target.value, value)

        let val = event.target.value
        if (!this.state.newLine)
            val = val.replace(/\n/g, ' ')
        val = val.replace(/\n{2,}/g, '\n');
        val = val.replace(/ {2,}/g, ' ');
        this.setState({ ...this.state, content: val })

    }

    toggleParagraph = paragraph => {

        this.forceUpdate()
    }

    componentDidUpdate(n, o) {
        if (this.state.content !== this.props.paragraph.content)
            this.setState({ content: this.props.paragraph.content })
    }

    componentDidMount() {

    }


    render() {
        const { paragraph, selectParagraph, views, key, classes } = this.props;
        const md = 12 /// views.length || 12



        //if (!views.includes(paragraph.type) || paragraph.hide) return null

        // raw content
        if (paragraph.type === 'raw')
            return (
                <Grid item xs={12} md={md} key={key}
                    className={classes[paragraph.type]}
                >
                    {paragraph.content}
                    <SmallTitle type={paragraph.type} />
                </Grid>
            )
        // somewhat proofread content
        else if (paragraph.type === 'proofread')
            return (
                <Grid item xs={12} md={md} key={key}
                    className={classes[paragraph.type]}
                >{!this.state.edit &&
                    <Hammer onPress={() => this.toggleState('edit', true)}
                        onSwipeLeft={(e) => this.props.selectParagraph(paragraph, -1)}
                        onSwipeRight={(e) => this.props.selectParagraph(paragraph, 1)}
                        onDoubleTap={e => console.log(e.type)}
                        options={{
                            recognizers: {
                                press: { time: 1500 },
                                swipe: { threshold: 200 }
                            }
                        }}
                    >
                        <div>
                            {this.state.content}
                            <SmallTitle type={paragraph.type} />
                        </div>
                    </Hammer>
                    }
                    {this.state.edit &&
                        <Box>
                            <TextField fullWidth
                                id="outlined-dense-multiline"
                                label="Proofread paragraph"
                                placeholder="Avoid new lines as they will be considered new chapters on next load"
                                //className={clsx(classes.textField, classes.dense)}
                                value={this.state.content}
                                onChange={this.editParagraph}
                                margin="dense"
                                variant="outlined"
                                multiline
                                rows="4"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.newLine}
                                        onChange={() => this.toggleState('newLine', !this.state.newLine)}
                                        value={this.state.newLine ? this.state.newLine : false}
                                        inputProps={{
                                            'aria-label': 'primary checkbox',
                                        }}
                                    />}
                                label="Allow New Lines" />
                            <Button type="submit">Submit</Button>
                            <Button onClick={() => this.toggleState('edit', false)} type="submit">Cancel</Button>
                        </Box>
                    }
                </Grid>
            )

        // actually machinetranslated content

        return (
            <Grid item xs={12} md={md} key={key}
                className={classes[paragraph.type]}
            >
                <Hammer onPress={() => this.props.selectParagraph(paragraph)}
                    onSwipeLeft={(e) => this.props.selectParagraph(paragraph, -1)}
                    onSwipeRight={(e) => this.props.selectParagraph(paragraph, 1)}
                    onDoubleTap={e => console.log(e.type)}
                    options={{
                        recognizers: {
                            press: { time: 1500 },
                            swipe: { threshold: 200 }
                        }
                    }}
                >
                    <div>
                        
                        {paragraph.row}
                        {paragraph.content}
                        <SmallTitle type={paragraph.type} />
                    </div>
                </Hammer>
            </Grid>
        );
    }
}

export default withStyles(styles)(ChapterDrawer);