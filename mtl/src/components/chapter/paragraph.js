import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Hammer from 'react-hammerjs'
import { useSpring, animated } from 'react-spring'


const styles = theme => ({
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
    button: {
        float: "right"
    },
});


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
        const { paragraph, proofreadParagraph, selectParagraph, key, classes } = this.props;
        const md = 12 /// views.length || 12

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
                >{!this.state.edit && this.state.content.length > 0 &&
                    <Hammer onPress={() => this.toggleState('edit', true)}
                        onSwipeLeft={() => selectParagraph(paragraph, -1)}
                        onSwipeRight={() => selectParagraph(paragraph, 1)}
                        onDoubleTap={e => console.log(e.type)}
                        options={{
                            recognizers: {
                                press: { time: 1500 },
                                swipe: { threshold: 200 }
                            }
                        }}
                    >
                        <div>
                            <span dangerouslySetInnerHTML={{ __html: this.state.tmp_content || this.state.content }} />
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
                                onChange={(e) => proofreadParagraph(e, paragraph)}
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
                            
                            <Button className={classes.button} 
                                variant="outlined"
                                color="secondary"
                                onClick={() => this.toggleState('edit', false)} type="submit">Hide</Button>
                        </Box>
                    }
                </Grid>
            )

        // actually machinetranslated content

        return (
            <Grid item xs={12} md={md} key={key}
                className={classes[paragraph.type]}
            >
                <Hammer onPress={() => selectParagraph(paragraph)}
                    onSwipeLeft={(e) => selectParagraph(paragraph, -1)}
                    onSwipeRight={(e) => selectParagraph(paragraph, 1)}
                    onDoubleTap={e => console.log(e.type)}
                    options={{
                        recognizers: {
                            press: { time: 1500 },
                            swipe: { threshold: 200 }
                        }
                    }}
                >
                    <div>
                        <span dangerouslySetInnerHTML={{ __html: this.state.content }} />
                        <SmallTitle type={paragraph.type} />
                    </div>
                </Hammer>
            </Grid>
        );
    }
}

export default withStyles(styles)(ChapterDrawer);