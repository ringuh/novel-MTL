const router = require('express').Router()
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // removes deprecated messages
var chalk = require('chalk'); // colors
const cheerioAdv = require('cheerio-advanced-selectors'); // adds :last, :eq(index), :first
const cheerio = cheerioAdv.wrap(require('cheerio'));
const readability = require('node-readability-cheerio')
const htmlToText = require('html-to-text');
const urlTool = require('url')

router.use(require('express').json())

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;


let Novel = require("../models/novel.model")
let Chapter = require("../models/chapter.model")







class Scraper {

    constructor() {

    }

    static async GetNovel(novelId) {

        var res = Novel.findOne({ _id: novelId })
            //.then((novel) => novel)
            .catch((err) => {
                console.log(termination(err.message))
                throw err
            })

        return res

    }

    static async GetChapter(chapterId) {

        var res = Chapter.findOne({ _id: chapterId })
            //.then((chapter) => chapter)
            .catch((err) => {
                console.log(termination(err.message))
                throw err
            })
        
        return res

    }



    static GetRules(url) {
        return raws.find(raw => {
            var a = urlTool.parse(raw.url)
            var b = urlTool.parse(url)

            return a.hostname == b.hostname
        });
    }

    static Init(novelId, chapterId) {
        console.log("init", novelId, chapterId)
        mongoose.connect(global.ServerConf.database, global.ServerConf.db_options)
        const db = mongoose.connection

        db.once('disconnected', function () {
            console.log(disconnected(`Scraper connection is disconnected`),
                mongoose.connection.readyState);
        });

        db.once('open', () => {
            let n = this.GetNovel(novelId)
            let c = this.GetChapter(chapterId)
            n.then((novel) => {
                if (chapterId == -1)
                    this.ParseRoot(novel)
                    .finally(() => mongoose.disconnect())
                else
                    c.then((chapter) => this.ParseChapter(chapter))
                console.log("exit db.once")
            })


        });

    }

    static ParseRoot(novel) {
        
        return new Promise((resolve, reject) => {
        const raw = this.GetRules(novel.raw_url)
        console.log(raw)
        if (!raw) return false

        

        readability.read(novel.raw_url, async function (err, $$) {
            if (err) { throw err }
            // switch to cheerio after fixing encoding.
            let $ = cheerio.load($$("html").html(), { decodeEntities: false });


            let image = $(raw.root.image_url).attr('src')
            let desc = htmlToText.fromString($(raw.root.description).html())
            let next = $(raw.root.chapters).attr("href")
            

            const GetNext = new Promise((resolve, reject) => {
                if (raw.root.catalog) {
                    var tmpUrl = urlTool.resolve(novel.raw_url, $(raw.root.catalog).attr("href"))
                    readability.read(tmpUrl, async function (err, $$$) {
                        $ = cheerio.load($$$("html").html(), { decodeEntities: false });
                        next = $(raw.root.chapters).attr("href")
                        resolve(next)

                    })
                }
                else{
                    resolve(next)
                }
            })

            next = await GetNext

            next = urlTool.resolve(novel.raw_url, next)
            console.log(next)
            const CreateChapter = await Chapter.findOne({
                novelId: novel._id,
                type: 'raw',
                url: next
            }).then((chapter) => {
                if(chapter) throw { "error": "already exists"}
                console.log("creating")
                    Chapter.create({
                        novelId: novel._id,
                        url: next
                    }).then((chap) => console.log("create chapter no catalog"));
            }).catch((err) => console.log(err)).finally(()=>{
                novel.image_url = image
                novel.description = novel.description || desc
                novel.save()
                console.log("save novel")
            })
            
            CreateChapter

        
            resolve(true)
        });
    });
}

    static ParseChapter(chapter) {
    console.log("parsing!", chapter)

    return true
    readability.read(chapter.url, function (err, $$) {
        if (err) { throw err }
        // switch to cheerio after fixing encoding.
        const $ = cheerio.load($$("html").html(), { decodeEntities: false });


        let title = htmlToText.fromString($(chapter.title).html())
        let content = htmlToText.fromString($(chapter.content).html())
        const next = $(chapter.next).attr("href")



        let tmpStr = title + "\n\n" +
            content +
            "\n\n-------------------\n" +
            next + "\n\n";

        fs.appendFile(tmpFile, tmpStr, function (err) {
            if (err) throw err;
        });
        count++;



        if (count > max_parse) return true
        ParseChapter({ ...chapter, url: urlTool.resolve(chapter.url, next) });
    });

}
}

module.exports = Scraper;


