import React, { /* Component */ } from 'react';
//import { BrowserRouter, Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
//import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        textAlign: 'left'
    },
});


const Header = () => {
    return (
        <div>
            <AppBar
                className=""
                color="primary"
                position="static"
            >
                <ToolBar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton> */}
                    
                    <a href="/">kotivalikko</a>
                    
                    <Typography>
                        qwert
                    </Typography>

                    {/* <Login /> */}
                </ToolBar>

            </AppBar >
        </div>
    )
}

export default Header;