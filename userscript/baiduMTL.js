// ==UserScript==
// @name         Baidu MTL
// @namespace    mtl.pienirinkula.com/
// @version      0.1
// @description  Downloads raw text from server and uploads it back
// @author       You
// @match        https://fanyi.baidu.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    
    const target = document.querySelector('textarea')
    const transBtn = document.getElementById("translate-button");
    var tbc = true;
    var chapters = [];
    var server = null;
    const translator = "baidu"

    var UI = '<div id="rimlu_mtl" style="margin-bottom: 1em">' +
        '<textarea id="mtl_console" placeholder="Console for showing progress" style="width: 100%;height: 200px;"></textarea>' +
        '<textarea id="mtl_command" placeholder="paste here the script from mtl.pienirinkula" style="width: 100%;height: 50px;"></textarea>' +
        '<button id="mtl_start">Parse</button>' +
        '<button id="mtl_stop">Stop</button>' +
        '</div>';
    $(".translate-wrap").prepend(UI);
    $("#mtl_command").val('{"url":"http://localhost:3001/novel/1/chapter","chapter_id":-1,"limit":100}')

    const PrintConsole = (str) => $("#mtl_console").val(str + "\n"+ $("#mtl_console").val())
    $("#mtl_stop").click(() => {
        PrintConsole("Stop activated")
        tbc = false
    });

    $("#mtl_start").click(() => {
        tbc = true

        var json = JSON.parse($("#mtl_command").val())
        server = json.url
        json.translator = translator

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("xhttp response", this.responseText)
                chapters = JSON.parse(this.responseText)
                PrintConsole(`Found ${chapters.length} chapters to translate`)
                HandleChapter(chapters, 0)
            }
        };
        xhttp.open("POST", server, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(json));



    });

    var HandleChapter = (chapters, index = 0) => {
        if(chapters.length === index || !tbc)
            return PrintConsole(`Finished translating`)
        //console.log("handle chapters", index, chapters[index])
        var chap = chapters[index]


        const targetNode = document.getElementsByClassName("output-wrap")[0]
        const config = { attributes: false, childList: true, subtree: true };

        var translatedText = []

        var HandleParts = (parts, j = 0) => {
            //console.log("handling", j, "of", parts.length)
            if (j == parts.length){

                var title = translatedText[0]

                translatedText.shift()
                var textContent = translatedText.join("\n")

                //var pattern = /(?<=\+\-\+\-)(.*)(?=\-\+\-\+)/i
                //title = textContent.match(pattern)
                //title = title ? title[0] : null
                //if(title) textContent = textContent.slice(textContent.indexOf("-+-+\n")+4)

                var d = JSON.stringify({ translator: translator, content: { title: title.trim(), content: textContent.trim() } })

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log("xhttp response", this.responseText)
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
                let cont = []
                $(".target-output").each(function(){ cont.push($(this).text())})
                cont = cont.join("\n")

                // there wait for the observer to really update
                if(translatedText.includes(cont)) return true
                translatedText.push(cont)

                observer.disconnect();
                HandleParts(parts, ++j)
            };


            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);

            target.value = parts[j]
            
            setTimeout(() => transBtn.click(), 500);
            //target.dispatchEvent(new Event('keyup'));


            //
        }


        $.ajax({
                url: server + "/" + chap.id,
                success: function (result) {
                    console.log("ajax", result)

                    if (result.raw && result.raw.content.length > 0) {
                        var parts = SplitTxt(result.raw);
                        HandleParts(parts)
                    }

                },
                type: 'get',
                async: false
            });




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