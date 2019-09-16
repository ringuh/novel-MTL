import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    root: {
        marginBottom: "3em"
    },
    snackbar: {
        //margin: theme.spacing(1),
        //color: amber[700],
        
        //backgroundColor: theme.palette.primary.main,
    },
    save: {
        backgroundColor: green[600],
    },
    icon: {
        marginRight: "0.5em"
    }
});


class ChapterSnackbar extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    Show = bool => {
        this.setState({ hide: !bool })
    }

    HideBtn = (
        <Button onClick={() => this.Show(false)} color="secondary" size="small">
            <CloseIcon fontSize="small" />
        </Button>
    )

    SaveBtn = (
        <Button color="secondary" size="small">
            Save
        </Button>
    )


    render() {
        let { classes, count, max } = this.props;
        let { hide } = this.state
        max = 3
        if (count === max)
            hide = false


        return (
            <div className={classes.snackbar}>
                <Snackbar className={classes.root}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={count > 0 && !hide}
                    onClose={() => "handleClose"}
                >
                    <SnackbarContent className={count < max ? classes.snackbar: classes.save}
                        message={
                            <span>
                                { count < max ? <InfoIcon className={classes.icon} fontSize='small' />
                                    : <CheckCircleIcon className={classes.icon} fontSize='small' s={1}/>}
                                {`Paragraphs proofread: ${count} / ${max}`}
                            </span>
                        }
                        action={count < max ? this.HideBtn : this.SaveBtn}
                    />
                </Snackbar>
            </div>
        );
    }
}

export default withStyles(styles)(ChapterSnackbar);