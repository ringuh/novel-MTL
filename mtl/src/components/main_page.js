import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'


const styles = theme => ({

    root: {

    },
    guide: {
        padding: "2em"
    }
});

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        //this.handleChange = this.handleChange.bind(this);

    }

    render() {
        const { classes } = this.props

        return (
            <Box component="div" className={classes.root}>
                <Paper className={classes.guide}>
                    <Typography variant="h5" align="left" paragraph
                        color="textPrimary">
                        Quick guide </Typography>

                    <Typography variant="body1" align="justify" paragraph
                        color="textPrimary">This is a semi-automated service for MTL-ing chinese web novels</Typography>

                    <Typography variant="subtitle2" paragraph align="left" color="error">
                        Supported translators:
                                <a href="https://fanyi.baidu.com"> fanyi.baidu.com </a>
                        <span>AND</span>
                        <a href="https://translate.sogou.com"> translate.sogou.com </a>
                    </Typography>
                    <Typography variant="subtitle2" align="justify" color="error" paragraph>
                        Supported chinese RAW sources:
                                <li><a href="https://www.kenshu.cc/xiaoshuo/111171/"> kenshu.cc </a></li>
                                
                                <li><a href="https://www.zhaishuyuan.com/book/20452/"> zhaishuyuan.com </a></li>
                        <li><a href="https://www.lewenxiaoshuo.com/books/gandiehenaxieganerzi/"> lewenxiaoshuo.com </a></li>
                    </Typography>
                    <Typography component="ol" variant="body1" align="justify" color="textSecondary">

                        <li>Download Tampermonkey-chrome extension</li>
                        <li>Add userscripts for
                                <a href="https://raw.githubusercontent.com/ringuh/novel-MTL/master/userscript/baiduMTL.js"> Baidu </a>
                            and
                                <a href="https://raw.githubusercontent.com/ringuh/novel-MTL/master/userscript/sogouMTL.js"> Sogou </a>
                            -translations to your tampermonkey
                            </li><br />


                        <li>Create new novel project</li>
                        <li>Set the novel RAW url to that novels main page in your chosen service</li>
                        <li>Press Initialize the novel</li>
                        <li>If chapter was created RAW url was supported</li>
                        <li>Press Scrape from the latest chapter -> wait for RAW chapters to load</li>
                        <li>Copy the translation string from the textbox</li>



                        <li>Open new browser to <a href="https://translate.sogou.com"> translate.sogou.com </a> and paste the translation string to the box asking for it.</li>
                        <li>Open new browser to <a href="https://fanyi.baidu.com"> fanyi.baidu.com </a> and paste the translation string to the box asking for it.</li>
                        <li>Press parse and wait for translations to be sent to the server. <br />Do note that Baidu might be really slow, but the translation quality is often better than sogou</li>
                        <br />
                        <li>Once you have translated enough chapters go to read the novel you just created and if you wish edit proofread versions of each chapter</li>
                        <li>If error happened in translation you can re-translate the chapter by copying a translation string from the chapters edit-page</li>



                    </Typography>
                </Paper>






            </Box>
        )
    }
}

export default withStyles(styles)(MainPage);