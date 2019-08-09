"use strict";
const cheerioAdv = require('cheerio-advanced-selectors'); // adds :last, :eq(index), :first
const cheerio = cheerioAdv.wrap(require('cheerio'));
const readability = require('node-readability-cheerio')
//const entities = require('entities') // entities.decodeHTML()
const fs = require('fs')
const urlTool = require('url')
const htmlToText = require('html-to-text');



/*var customHeaderRequest = request.defaults({
    headers: {'User-Agent': ua}
})*/

var defNovel = [{
	url: "https://www.lewenxiaoshuo.com/books/xinhunwuai_tizuiqianqi/34621639.html",
	next: ".bottem1>a:last",
	title: ".bookname > h1",
	content: "#content",
	encoding: 'gbk',
},
{
	url: "https://www.kenshu.cc/xiaoshuo/30192/75481194/",
	next: ".articlebtn>a:eq(3)",
	title: ".article-title",
	content: ".article-con",
},

];


var count = 0
var max_parse = 100
var tmpFile = "tmp_novels.tmp"



fs.writeFile(tmpFile, "", function (err) {
	if (err) throw err;
});


const ParseChapter = (chapter) => {
	console.log(count, "parsing", chapter.url)
	
	readability.read(chapter.url, function (err, $$) {
		if(err){ 
			throw err
		}
		
		
		
		// switch to cheerio after fixing encoding.
		const $ = cheerio.load($$("html").html(), { decodeEntities: false });
		

		let title = htmlToText.fromString($(chapter.title).html())
		let content = htmlToText.fromString($(chapter.content).html())		
		const next = $(chapter.next).attr("href")

		

		let tmpStr = title+"\n\n"+
		content + 
		"\n\n-------------------\n"+
		next+"\n\n";

		fs.appendFile(tmpFile, tmpStr, function (err) {
			if (err) throw err;
		});
		count++;

		

		if (count > max_parse) return true
			ParseChapter({ ...chapter, url: urlTool.resolve(chapter.url, next) });
	});
};




ParseChapter(defNovel[0]);