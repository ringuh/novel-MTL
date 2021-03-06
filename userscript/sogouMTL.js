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
    let translateStr = { key: "translateStr", value: sessionStorage.getItem('translateStr') || '' }
    let jwt = sessionStorage.getItem('jwt')
    const delay = 1500


    var UI = '<div id="rimlu_mtl">' +
        '<textarea id="mtl_console" placeholder="Console for showing progress" style="width: 100%;height: 200px;"></textarea>' +
        '<textarea id="mtl_command" placeholder="paste here the script from mtl.pienirinkula" style="width: 100%;height: 50px;"></textarea>' +
        '<button id="mtl_start">Parse</button>' +
        '<button id="mtl_stop">Stop</button>' +
        '</div>';
    $("#box-logo").append(UI);
    setTimeout(() => $("#mtl_command").val(translateStr.value), 500)

    const PrintConsole = (str) => $("#mtl_console").val(str + "\n" + $("#mtl_console").val())
    $("#mtl_stop").click(() => {
        PrintConsole("Stop activated")
        tbc = false
    });

    $("#mtl_start").click(() => {
        tbc = true

        var json = $("#mtl_command").val()
        json = JSON.parse(json)
        if (json.jwt) sessionStorage.setItem("jwt", json.jwt)
        delete json.jwt
        json = JSON.stringify(json)
        sessionStorage.setItem(translateStr.key, json)
        $("#mtl_command").val(json)

        jwt = sessionStorage.getItem("jwt")
        if (!jwt) return alert("JWT token missing. repaste the string")

        json = JSON.parse(json)
        server = json.url
        delete json.url
        json.translator = translator
        json.includes = "raw"


        var url = new URL(server)
        url.search = new URLSearchParams(json).toString();


        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                chapters = JSON.parse(this.responseText)
                console.log("chapterlist", chapters)
                PrintConsole(`Found ${chapters.length} chapters to translate`)
                target.value = ""
                HandleChapter(chapters, 0)
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("Authorization", "Bearer " + jwt);
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

        var HandleParts = async (parts, j = 0) => {
            console.log("handling", j, "of", parts.length)
            let slowDown = new Promise((resolve, reject) =>
                setTimeout(() => resolve(console.log("slow down", delay)), delay))
            await slowDown;

            if (j == parts.length) {
                var title = translatedText[0].replace(/呀，出错误了！再试下吧。/g, "")
                translatedText.shift()
                var textContent = translatedText.join("\n")
                // error happened-text replaced
                textContent = textContent.replace(/呀，出错误了！再试下吧。/g, "")

                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log("translation response", JSON.parse(this.responseText))
                        PrintConsole(`Translated chapter ${chap.order} (id:${chap.id}) @ ${chap.url}`)
                        target.value = "";
                        HandleChapter(chapters, ++index)
                    }
                };
                xhttp.open("POST", server + "/" + chap.id, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.setRequestHeader("Authorization", "Bearer " + jwt);

                var d = JSON.stringify({
                    translator: translator,
                    content: {
                        title: title.trim(),
                        content: textContent.trim(),
                        hash: chap.raw.hash
                    }
                })
                xhttp.send(d);


                return true

            }

            const callback = function (mutationsList, observer) {
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

        if (chap.raw && chap.raw.content.length) {
            var parts = SplitTxt(chap.raw);
            HandleParts(parts)
        }
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