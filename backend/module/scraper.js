const chalk = require('chalk'); // colors
const cheerioAdv = require('cheerio-advanced-selectors'); // adds :last, :eq(index), :first
const cheerio = cheerioAdv.wrap(require('cheerio'));
const readability = require('node-readability-cheerio')
const htmlToText = require('html-to-text');
const urlTool = require('url')

const { cyan, yellow, red, blue } = chalk.bold;

const { Novel, Chapter, Raw, Content } = require("../models")


const GetRaw = async (url) => {
    // finds the correct RAW-parser based on your URL

    return new Promise((resolve, reject) => {
        Raw.findAll({}).then((raws) =>
            resolve(raws.find(raw => {
                var a = urlTool.parse(raw.url)
                var b = urlTool.parse(url)

                return a.hostname == b.hostname
            })))
    })
}

const GetChapter = async (novel, chapter_id) => {
    let whereStr = chapter_id === -1 ?
        { novel_id: novel.id } : { id: chapter_id, novel_id: novel.id }
    let orderArr = [
        ["order", "DESC"],
        ["id", "ASC"]
    ]

    Chapter.findAll({
        where: whereStr,
        order: orderArr
    })


    return Chapter.findOne({
        where: whereStr,
        order: orderArr
    }).catch((err) => {
        console.log(red(err.message))
        throw err
    })
}

const ReadDom = async (url) => {
    // due issues with chinese encoding this double parses the DOM.
    // first reads DOM through readability for encoding 
    // and re-parses the result through cheerio for usability
    return new Promise((resolve, reject) => {
        readability.read(url, async function (err, $) {
            if (err) reject(err)
            resolve(cheerio.load($("html").html(), { decodeEntities: false }))
        })
    })
}


const Scraper = async (data, connection) => {
    console.log(data)
    const sendJson = (json) => {
        // send through websocket as JSON string
        if (!connection) return false
        try {
            if (typeof (json) == "string")
                json = { msg: json }
            connection.sendUTF(JSON.stringify(json))
        }
        catch (error) { console.log(red("SendJson error:", error)) }

        return json
    }

    const Init = async () => {
        const novel = await Novel.findByPk(data.novel_id)
        if (!novel) return sendJson("Novel not found")

        const chapter = await GetChapter(novel, data.chapter_id)
        if (!chapter && data.chapter_id === -1) return ScrapeRoot(novel)
        else if (chapter) return ScrapeChapter(chapter, data.limit)
    }




    const ScrapeRoot = async (novel) => {
        // get the parser template for this website
        const raw = await GetRaw(novel.raw_url)
        if (!raw) return sendJson(`Parser template not found for ${novel.raw_url}`)


        // parse the DOM
        let $ = await ReadDom(novel.raw_url)
        let image = null
        let desc = null
        let next = null

        if (raw.root) {
            image = $(raw.root.image_url).attr('src')
            desc = htmlToText.fromString($(raw.root.description).html())
            // if raw.root.catalog exists presume that novel name and chapter-list are on separate page
            if (raw.root.catalog)
                $ = await ReadDom(urlTool.resolve(
                    novel.raw_url, $(raw.root.catalog).attr("href")))
            // parse the URL for the first chapter
            next = raw.root.chapters ? urlTool.resolve(novel.raw_url, $(raw.root.chapters).attr("href")) : null
        }



        

        // check the chapter URL against regex
        let pattern = new RegExp(raw.regex, "i")
        // generate empty chapter if no root info
        if (!raw.root || next.match(pattern))
            Chapter.findOrCreate({
                where: { novel_id: novel.id, url: next }
            }).then(([chapter, created]) => {
                if (!created) throw { "msg": "Initial chapter already exists" }


                // initialize the descriptions if chapter was created
                novel.image_url = image || novel.image_url
                novel.description = novel.description || desc
                novel.save()
                sendJson({ cmd: "reload_novel", msg: "Novel initialized. Reloading chapters" })
            }).catch((err) => sendJson({ cmd: "scrape_ended", msg: err.message}))
    }

    const ScrapeChapter = async (chapter, limit = global.config.limit) => {
        console.log(limit, "scrape chapter", chapter.url, "id", chapter.id, "order", chapter.order)
        // get the parser template for this website
        const raw = await GetRaw(chapter.url)
        if (!raw) return sendJson(`Parser template not found for ${chapter.url}`)

        // parse the DOM
        let $ = await ReadDom(chapter.url)
        let title = htmlToText.fromString($(raw.title).html())
        let content = htmlToText.fromString($(raw.content).html())
        let next = urlTool.resolve(chapter.url, $(raw.next).attr("href"))
        let pattern = new RegExp(raw.regex, "i")

        /* var fs = require('fs');
        fs.appendFile('mynewfile1.html', $("html").html(), function (err) {
        if (err) throw err;
        console.log('Saved!');
        }); */

        await Content.findOrCreate({
            where: { chapter_id: chapter.id, type: "raw" },
            defaults: { title: title, content: content }
        }).then(([nc, created]) => chapter.setRaw(nc))

        // check if the next chapter matches the regex
        if (!next.match(pattern)) return sendJson({ cmd: "scrape_ended", msg: `Regex for next chapter doesn't match ${next}`})

        Chapter.findOrCreate({
            where: { novel_id: chapter.novel_id, url: next },
            defaults: { order: chapter.order + 1 }
        }).then(async ([chapter, created]) => {
            if (created) sendJson({ cmd: "reload_chapters", msg: `Added new chapter ${next} (+${limit})` })
            if (limit > 1) // delay the parsing speed to avoid issues with being detected
                setTimeout(async () => ScrapeChapter(chapter, --limit), 1000)
            else sendJson({cmd: "scrape_ended", msg: "Mission finished"})
        }).catch((err) => sendJson({ cmd: "scrape_ended", msg: err.message}))





    };

    try{
        Init()
    } catch(err) {
        console.log(cyan(err.message))
        sendJson({ cmd: "scrape_ended", msg: err.message})
    }
    

}

module.exports = Scraper