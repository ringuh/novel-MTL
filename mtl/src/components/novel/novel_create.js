import React from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        textAlign: 'left'
    },
});


class NovelCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);

    }

    toggleOpen() {
        this.setState({ openDialog: !this.state.openDialog })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value, 
            message: null,
            error: false })        
    }

    handleSubmit() {
        var subm = async () => {
            this.setState({progress: true})
            
            axios.post('/api/novel/create', { name: this.state.name })
                .then(res => {
                    setTimeout(() => this.setState({ id: res.data.id, message: res.data.message }), 1000)
                }).catch((err) => {
                    this.setState({ message: err.response.data.message, error: true, progress: false })
                })
        };
        subm();
    }

    render() {
        if (this.state.id) {
            return <Redirect to={'/novel/'+this.state.id} />
        }


        return (
            <div>
                <Button size="small"
                    onClick={this.toggleOpen}
                    variant="outlined"
                    color="primary">
                    <AddIcon fontSize="inherit" />
                    Create novel
                </Button>
                <Dialog open={this.state.openDialog}
                    onClose={this.toggleOpen}
                    maxWidth='sm'
                    fullWidth
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New novel</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Name your new novel project
                        </DialogContentText>
                        <TextField
                            autoFocus
                            autoComplete="off"
                            disabled={this.state.progress}
                            onChange={this.handleChange}
                            margin="dense"
                            id="name"
                            name="name"
                            label="Novel name"
                            type="text"
                            error={this.state.error}
                            helperText={this.state.message}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleOpen} color="secondary">
                            Cancel
                        </Button>
                        
                        {this.state.progress ? 
                        (<CircularProgress />):
                        (<Button type="submit" display="none" onClick={this.handleSubmit} color="primary">
                            Create
                            
                        </Button>)
                        }
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}

export default withStyles(styles)(NovelCreate)
