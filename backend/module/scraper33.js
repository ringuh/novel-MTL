const chalk = require('chalk'); // colors
const cheerioAdv = require('cheerio-advanced-selectors'); // adds :last, :eq(index), :first
const cheerio = cheerioAdv.wrap(require('cheerio'));
const readability = require('node-readability-cheerio')
const htmlToText = require('html-to-text');
const urlTool = require('url')

const cyan = chalk.bold.cyan;
const yellow = chalk.bold.yellow;
const red = chalk.bold.red;
const magenta = chalk.bold.magenta;

const { Novel, Chapter, Raw } = require("../models")

console.log("in scraper")
const raws = [{
    url: "https://www.lewenxiaoshuo.com/books/xinhunwuai_tizuiqianqi/34622958.html",
    next: ".bottem1>a:last",
    title: ".bookname > h1",
    content: "#content",
    root: {
        image_url: "#fmimg > img",
        description: "#intro",
        catalog: null,
        chapters: "#list > dl > dd > a"
    }
}, {
    url: "https://www.kenshu.cc/xiaoshuo/30192/75481194/",
    next: ".articlebtn>a:eq(3)",
    title: ".article-title",
    content: ".article-con",
    root: {
        image_url: ".bigpic > img",
        description: ".book-intro > div:eq(0)",
        catalog: "a.catalogbtn",
        chapters: "ul.chapter-list > li > span > a"
    }
}]

const GetRaw = async (url) => {
    console.log("getting raw")


    return new Promise((resolve, reject) => {
        setTimeout(() =>
            Raw.find({}).then((raws) =>
                resolve(raws.find(raw => {
                    var a = urlTool.parse(raw.url)
                    var b = urlTool.parse(url)

                    return a.hostname == b.hostname
                }))
            ), 1200)
    })
}

const GetNovel = async (novelId) => {
    return Novel.findOne({ _id: novelId || "5d537ca24608762734b47b59" })
        .then((novel) => novel)
        .catch((err) => {
            console.log(termination(err.message))
            throw err
        })
}

const GetChapter = async (novel, chapterId) => {
    let queryStr = { _id: chapterId, novelId: novel._id, type: 'raw' }
    if (chapterId === -1)
        queryStr = { novelId: novel._id, type: 'raw' }
    let sort = {
        id: -1,
        createdAt: -1,
    }

    return Chapter.findOne(queryStr).sort(sort)
        //.then((chapter) => chapter)
        .catch((err) => {
            console.log(termination(err.message))
            throw err
        })
}



const ReadDom = async (url) => {
    return new Promise((resolve, reject) => {
        readability.read(url, async function (err, $) {
            if (err) reject(err)
            resolve(cheerio.load($("html").html(), { decodeEntities: false }))
        })
    })
}


module.exports = (data, connection) => {
    console.log("SCRAPER2", data)

    const sendJson = (json) => {
        if (!connection) return false
        try {
            if (typeof (json) == "string")
                json = { msg: json }
            connection.sendUTF(JSON.stringify(json))
        }
        catch (error) { console.log("SendJson error:", error) }

        return json
    }

    // initialize database
    const db = mongoose.connection
    if(db.readyState !== 1)
        mongoose.connect(global.ServerConf.database, global.ServerConf.db_options)
    
    db.once('disconnected', () => {
        console.log(disconnected(`Scraper connection is disconnected`),
            mongoose.connection.readyState);
    });

    // start action
    db.once('open', () => {
        // find novel
        let novel = null
        let n = GetNovel(data.novelId)
        n.then((nov) => {
            novel = nov;
            return GetChapter(novel, data.chapterId)
            if (data.chapterId === -1)
                return ScrapeRoot(novel)

        }).then((chapter) => {
            if (!chapter && data.chapterId === -1)
                return ScrapeRoot(novel)
            else if (chapter)
                return ScrapeChapter(chapter, data.limit)
        }).then((novel) => console.log("the end", novel))
            .catch((err) => console.log("catch", err))
            .finally(() => {
                console.log("finally")
                try { mongoose.disconnect() } catch (e) {
                    console.log("mongo error")
                }
                sendJson({ msg: "Finished scraping" })
            })
        // find chapter

    });




    const ScrapeRoot = async (novel) => {
        console.log("scrapeRoot")
        const raw = await GetRaw(novel.raw_url)
        if (!raw) return "raw-template not found"

        //const raw = GetRaw(novel.raw_url)
        if (!raw) {
            reject("no raw found")
            return false
        }
        console.log(novel.raw_url, raw.regex)
        let $ = await ReadDom(novel.raw_url)
        let image = $(raw.root.image_url).attr('src')
        let desc = htmlToText.fromString($(raw.root.description).html())

        if (raw.root.catalog)
            $ = await ReadDom(urlTool.resolve(
                novel.raw_url, $(raw.root.catalog).attr("href")))
        let next = $(raw.root.chapters).attr("href")
        next = urlTool.resolve(novel.raw_url, next)
        console.log(image)
        console.log(next)
        console.log(desc)
        let pattern = new RegExp(raw.regex, "i")
        if (next.match(pattern))
            await Chapter.findOne({
                novelId: novel._id,
                type: 'raw',
                url: next
            }).then((chapter) => {
                if (chapter) throw { "msg": "Initial chapter already exists" }
            }).then(async () => {
                return Chapter.create({
                    novelId: novel._id,
                    url: next
                }).then((chapter) => {
                    novel.image_url = image
                    novel.description = novel.description || desc
                    novel.save()
                    sendJson({ command: "reload_chapters", msg: "Novel initialized. Reloading chapters" })
                })
            }).catch((err) => sendJson(err))





    }

    const CreateChapter = async (novelId, url) => {
        console.log("in create promise")

        var n = await Chapter.findOne({
            novelId: novelId,
            type: 'raw',
            url: url
        })
        if (n) return n

        return Chapter.create({
            novelId: novelId,
            type: 'raw',
            url: url
        }).then((chapter) => {
            sendJson({ command: "reload_chapters", msg: "Added new chapter", url })
            return chapter
        })

       

        /*  Chapter.findOne({
             novelId: novelId,
             type: 'raw',
             url: url
         }).then(async (chapter) => {
             console.log("find one")
             if (chapter) resolve(chapter)
             console.log("creating new chapter")
             Chapter.create({
                 novelId: novelId,
                 type: 'raw',
                 url: url
             }).then((chapter) => {
                 sendJson({ command: "reload_chapters", msg: "Added new chapter", url })
                 resolve(chapter)
             })
         }).catch((err) => {
             sendJson(err)
         }) */
    }


    const ScrapeChapter = async (chapter, limit = 5) => {
        console.log(limit, "scrape chapter", chapter.url)
        const raw = await GetRaw(chapter.url)
        if (!raw) return "raw-template not found"

        //const raw = GetRaw(novel.raw_url)
        if (!raw) {
            reject("no raw found")
            return false
        }
        console.log("reading dom")
        let $ = await ReadDom(chapter.url)
        console.log("ended reading dom")
        let title = htmlToText.fromString($(raw.title).html())
        let content = htmlToText.fromString($(raw.content).html())
        let next = urlTool.resolve(chapter.url, $(raw.next).attr("href"))
        let pattern = new RegExp(raw.regex, "i")

        console.log("title", title)
        console.log("content length", content.length)
        console.log("next link", next)

        chapter.title = title
        chapter.content = content
        chapter.save()

        console.log("save success")
        if (next.match(pattern)) {
            console.log("matched pattern", limit)

            let nextChapter = await CreateChapter(chapter.novelId, next)

            console.log("after create", nextChapter)

            if (limit > 0)
                await ScrapeChapter(nextChapter, --limit)

        }
        else
            console.log("pattern didnt match", next)

        console.log("quitter")
        return true
    }
};


