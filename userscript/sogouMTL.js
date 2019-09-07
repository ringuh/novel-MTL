// ==UserScript==
// @name         Sogou MTL
// @namespace    mtl.pienirinkula.com/
// @version      0.1
// @description  Downloads raw text from server and uploads it back
// @author       You
// @match        https://translate.sogou.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function () {
    'use strict';
    const target = document.querySelector('textarea')
    var tbc = true;
    var chapters = [];
    var server = null;
    const translator = "sogou"


    var UI = '<div id="rimlu_mtl">' +
        '<textarea id="mtl_console" placeholder="Console for showing progress" style="width: 100%;height: 200px;"></textarea>' +
        '<textarea id="mtl_command" placeholder="paste here the script from mtl.pienirinkula" style="width: 100%;height: 50px;"></textarea>' +
        '<button id="mtl_start">Parse</button>' +
        '<button id="mtl_stop">Stop</button>' +
        '</div>';
    $("#box-logo").append(UI);
    $("#mtl_command").val('{"url":"http://localhost:3001/novel/1/chapter","chapter_id":-1,"limit":100}')

    const PrintConsole = (str) => $("#mtl_console").val(str + "\n" + $("#mtl_console").val())
    $("#mtl_stop").click(() => {
        PrintConsole("Stop activated")
        tbc = false
    });

    $("#mtl_start").click(() => {
        tbc = true

        var json = JSON.parse($("#mtl_command").val())
        server = json.url
        delete json.url
        json.translator = translator
        json.includes = "raw"


        var url = new URL(server)
        url.search = new URLSearchParams(json).toString();


        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                chapters = JSON.parse(this.responseText)
                console.log("chapterlist", chapters)
                PrintConsole(`Found ${chapters.length} chapters to translate`)
                HandleChapter(chapters, 0)
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(json));



    });

    var HandleChapter = (chapters, index = 0) => {
        if (chapters.length === index || !tbc)
            return PrintConsole(`Finished translating`)
        //console.log("handle chapters", index, chapters[index])
        var chap = chapters[index]


        const targetNode = document.getElementById('translation-to');
        const config = { attributes: false, childList: true, subtree: true };

        var translatedText = []

        var HandleParts = (parts, j = 0) => {
            //console.log("handling", j, "of", parts.length)
            if (j == parts.length) {

                var title = translatedText[0]
                translatedText.shift()
                var textContent = translatedText.join("\n")

                var d = JSON.stringify({ translator: translator, content: { title: title.trim(), content: textContent.trim() } })


                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log("translation response", JSON.parse(this.responseText))
                        PrintConsole(`Translated chapter ${chap.id} @ ${chap.url}`)
                        HandleChapter(chapters, ++index)
                    }
                };
                xhttp.open("POST", server + "/" + chap.id, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(d);


                return true

            }

            const callback = function (mutationsList, observer) {
                //console.log("joku mutaatio", mutationsList)
                const cont = $("#translation-to").text()
                // there wait for the observer to really update
                if (translatedText.includes(cont)) return true
                translatedText.push(cont)

                observer.disconnect();
                HandleParts(parts, ++j)
            };


            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);

            target.value = parts[j]
            target.dispatchEvent(new Event('keyup'));

        }
        console.log(chap.id)
        //var d = JSON.stringify({  })
        var url = new URL(`${server}/${chap.id}`)
        //url.search = new URLSearchParams(json).toString();
        var xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let result = JSON.parse(this.responseText)
                console.log("chapter data", result)
                if (result.raw && result.raw.content.length > 0) {
                    var parts = SplitTxt(result.raw);
                    HandleParts(parts)
                }
            };
        }
        xhttp2.open("GET", url, true);
        xhttp2.setRequestHeader("Content-type", "application/json");
        xhttp2.send("");
    };

    var SplitTxt = (raw) => {

        var limit = 1500
        var arr = raw.content.split("\n")
        //arr.unshift(`+-+- ${raw.title} -+-+`)

        var retArr = [raw.title ? raw.title : "缺少标题"]
        var partArr = []

        for (var i in arr) {
            var x = arr[i]

            if (partArr.join("\n").length + x.length < limit) {
                partArr.push(x)
            } else {
                retArr.push(partArr.join("\n"))
                partArr = [x]
            }
        }

        retArr.push(partArr.join("\n"))


        return retArr
    };

})();