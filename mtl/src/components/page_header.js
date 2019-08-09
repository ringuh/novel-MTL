import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar';
//import { Form, Button } from 'react-bootstrap';

const Header = () => {
    return (
        <div>
            <AppBar
                className=""
                color="primary"
                position="fixed"
            >
                <ToolBar>
                    <Typography>
                        qwert
                    </Typography>
                </ToolBar>

            </AppBar >
        </div>
    )
}

export default Header;