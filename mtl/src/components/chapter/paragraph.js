import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { red, green, cyan } from '@material-ui/core/colors'
import TextField from '@material-ui/core/TextField'

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Hammer from 'react-hammerjs'
import { useSpring, animated } from 'react-spring'


const styles = theme => ({
    paragraph: {
        backgroundColor: 'red'
    },
    raw: {
        color: red[700],
    },
    proofread: {
        padding: '1em',
    },
    baidu: {
        padding: '1em',
        color: cyan[700]
    },
    sogou: {
        padding: '1em',
        color: green[700]
    },
    border: {
        border: "1px solid black"
    },
    button: {
        float: "right"
    },
    words: {
        marginTop: '2em'
    }
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
        this.setState({ [attr]: value })
    }

    proofreadParagraph = (event, paragraph) => {
        console.log(this.state)
        let val = event.target.value
        if (!this.state.newLine)
            val = val.replace(/\n/g, ' ')
        val = val.replace(/\n{2,}/g, '\n');
        val = val.replace(/ {2,}/g, ' ');
        paragraph.content = val

        this.setState({ ...this.state })
        this.props.parent.setState({
            proofread: {
                ...this.props.parent.state.proofread,
                count: this.props.parent.state.paragraphs.filter(p => p.type === 'proofread' && p.content.length > 0).length
            },
        })
    }

    selectParagraph = (paragraph, option = 0) => {
        let alternatives = this.props.parent.state.paragraphs.filter(p =>
            p.row === paragraph.row && p.type !== 'raw')
        const proofread = alternatives.find(p => p.type === "proofread")
        alternatives = alternatives.filter(p => p.content.length > 0)

        if (option === 0) { // pre-selecting proofread content
            // allow long press on translation to replace proofread if empty or exactly same as a translation
            if (proofread.content.length === 0 || alternatives.find(p => p.content === proofread.content))
                proofread.content = paragraph.content

            paragraph.hide = true
            proofread.hide = false



            return this.props.parent.setState({
                proofread: {
                    ...this.props.parent.state.proofread,
                    count: this.props.parent.state.paragraphs.filter(p => p.type === 'proofread' && p.content.length > 0).length
                },
            })
        }

        const index = alternatives.indexOf(paragraph)
        let targetIndex = index + option
        if (targetIndex >= alternatives.length) targetIndex = 0
        else if (targetIndex < 0) targetIndex = alternatives.length - 1

        paragraph.hide = true
        alternatives[targetIndex].hide = false

        this.props.parent.setState({ paragraphs: this.props.parent.state.paragraphs })

    }

    Words = props => {
        return <Typography color="textSecondary" variant="body2" display="block" className={props.className}>
            words: {props.words.split(/\s+/).length} | characters: {props.words.length}
        </Typography>
    }


    componentDidUpdate(n, o) {
        if (this.state.content !== this.props.paragraph.content)
            this.setState({ content: this.props.paragraph.content })
    }

    componentDidMount() {

    }


    render() {
        const { paragraph, md, key, classes, words, parent } = this.props;
        const { proofreadParagraph, selectParagraph } = this

        // raw content
        if (paragraph.type === 'raw')
            return (
                <Grid item xs={12} md={md} key={key}
                    className={classes[paragraph.type]}
                >
                    {paragraph.content}
                    <SmallTitle type={paragraph.type} />
                    {words && <this.Words className={classes.words} words={words} />}
                </Grid>
            )
        // somewhat proofread content
        else if (paragraph.type === 'proofread')
            return (
                <Grid item xs={12} md={md} key={key}
                    className={classes[paragraph.type]}
                >{!this.state.edit && this.state.content.length > 0 &&
                    <Hammer onPress={e => this.toggleState('edit', true)}
                        onSwipeLeft={e => selectParagraph(paragraph, -1)}
                        onSwipeRight={e => selectParagraph(paragraph, 1)}
                        onDoubleTap={e => this.toggleState('edit', true)}
                        options={{
                            recognizers: {
                                press: { time: 1000 },
                                //swipe: { threshold: 200 }
                            }
                        }}
                    >
                        <div>
                            <span dangerouslySetInnerHTML={{ __html: this.state.content }} />
                            <SmallTitle type={paragraph.type} />
                            {words && <this.Words className={classes.words} words={words} />}
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
                <Hammer onPress={e => selectParagraph(paragraph)}
                    onSwipeLeft={e => selectParagraph(paragraph, -1)}
                    onSwipeRight={e => selectParagraph(paragraph, 1)}
                    onDoubleTap={e => selectParagraph(paragraph)}
                    options={{
                        recognizers: {
                            press: { time: 1000 },
                            //swipe: { threshold: 200 }
                        }
                    }}
                >
                    <div>
                        <span dangerouslySetInnerHTML={{ __html: this.state.content }} />
                        <SmallTitle type={paragraph.type} />
                        {words && <this.Words className={classes.words} words={words} />}
                    </div>
                </Hammer>
            </Grid>
        );
    }
}

export default withStyles(styles)(ChapterDrawer);