import React, { Component } from 'react';
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



const styles = {
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
        color: "var(--secondary)"
    },
    baidu: {
        padding: '1em',
        color: "var(--cyan)"
    },
    sogou: {
        padding: '1em',
        color: "var(--gray)"
    },
    border: {
        border: "1px solid black"
    }
};


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


    editParagraph = (event, value) => {
        event.preventDefault()
        //console.log(event.target.value, value)

        let val = event.target.value
        if(!this.state.newLine)
            val = val.replace(/\n/g, ' ')
        val = val.replace(/\n{2,}/g, '\n');
        val = val.replace(/ {2,}/g, ' ');
        this.setState({ ...this.state, content: val })

    }

    componentDidUpdate(n, o) {        
        if(this.state.content !== this.props.paragraph.content)
            this.setState({content: this.props.paragraph.content})
    }

    componentDidMount() {

    }

    render() {
        const { paragraph, selectParagraph, views, key, classes } = this.props;
        const md = 12 / views.length || 12

        if(!views.includes(paragraph.type)) return null

        // raw content
        if (paragraph.type === 'raw')
            return (
                <Grid item xs={12} md={md} key={key}
                    className={[classes[paragraph.type]]}
                >
                    {paragraph.content}
                </Grid>
            )
        // somewhat proofread content
        else if (paragraph.type === 'proofread')
            return (
                <Grid item xs={12} md={md} key={key}
                    className={classes[paragraph.type]}
                >{!this.state.edit &&
                    <div>
                        <button onClick={() => this.toggleState('edit', true)}>Edit</button>
                        {this.state.content}
                    </div>
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
                                /> }
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
                <button onClick={() => selectParagraph(paragraph, 'select')}>Select</button>
                
                <ArrowBackIcon onClick={() => selectParagraph(paragraph)} />
                {paragraph.row}.
                    {paragraph.content}
            </Grid>
        );
    }
}

export default withStyles(styles)(ChapterDrawer);