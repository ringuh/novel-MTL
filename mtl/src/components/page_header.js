import React, { /* Component */ } from 'react';
import { withRouter, Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/HomeOutlined'
import ExitIcon from '@material-ui/icons/ExitToApp'
import NovelCreate from './novel/novel_create';
import Login from './login'

const styles = theme => ({
    root: {
        maxWidth: theme.breakpoints.values.lg,
        margin: "auto",
        /* marginLeft: "auto",
        marginRight: "auto", */
        /* [theme.breakpoints.up(xs)]: {
            marginLeft: 'auto',
            marginRight: 'auto'
        } */
        marginBottom: theme.spacing(2),
        "& .MuiToolbar-root": {
            justifyContent: "space-between",
        }
    },
});


const Header = (props) => {
    const { classes, location } = props
    if (location.pathname.match(/\/novel\/.*\/chapter/gi))
        return (<div className={classes.root}></div>)

    // not logged
    if (!global.user)
        return (
            <AppBar className={classes.root} color="default" position="static">
                <ToolBar>
                    <Breadcrumbs separator="">
                        <a href="/">
                            <HomeIcon color="secondary" />
                        </a>
                    </Breadcrumbs>
                    <Breadcrumbs separator="">
                        <Login />
                    </Breadcrumbs>
                </ToolBar>


            </AppBar >
        )

    // logged in
    return (
        <AppBar className={classes.root} color="default" position="static">
            <ToolBar>
                <Breadcrumbs separator="">
                    <a href="/"> <HomeIcon color="secondary" /> </a>

                    <a href="/novel">
                        <Typography color="secondary">
                            Novels
                        </Typography>
                    </a>
                </Breadcrumbs>
                <Breadcrumbs separator="">
                    <NovelCreate />

                    <Button component={Link} to="/logout">
                        Log out <ExitIcon color="secondary" />
                    </Button>

                </Breadcrumbs>
            </ToolBar>
        </AppBar >
    )
}

export default withRouter(withStyles(styles)(Header));