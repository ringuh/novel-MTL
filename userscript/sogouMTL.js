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

(function() {
    'use strict';
    const target = document.querySelector('textarea')
    var tbc = true;
    var chapters = [];
    var server = null;


    var UI = '<div id="rimlu_mtl">' +
        '<textarea id="mtl_console" placeholder="Console for showing progress" style="width: 100%;height: 200px;"></textarea>' +
        '<textarea id="mtl_command" placeholder="paste here the script from mtl.pienirinkula" style="width: 100%;height: 50px;"></textarea>' +
        '<button id="mtl_start">Parse</button>' +
        '<button id="mtl_stop">Stop</button>' +
        '</div>';
    $("#box-logo").append(UI);
    $("#mtl_command").val('{"url":"http://localhost:3001/novel/5d5418c95588601b9409a759/chapter","chapterId":-1,"limit":100}')
    $("#mtl_start").click(() => {
        tbc = true
        console.log("clicked start")
        var json = JSON.parse($("#mtl_command").val())
        server = json.url

        $("#mtl_stop").click(() => {
            console.log("clicked stop")
            tbc = false
        });

        $.get(server, function (data) {
            console.log(data)
            chapters = data
            HandleChapter(chapters, 0)
        });



    });

    var HandleChapter = (chapters, index = 0) => {
        if(chapters.length === index)
            return true
        console.log("HandleChapter", chapters[index], chapters.length)
        
        var chap = chapters[index]
            

        const targetNode = document.getElementById('translation-to');
        const config = { attributes: false, childList: true, subtree: true };

        var translatedText = []

        var HandleParts = (parts, j = 0) => {
            console.log(parts.length, "handling")
            if (j == parts.length){
                console.log("translatedText", translatedText.length)
                console.log(translatedText)
                return HandleChapter(chapters, ++index)
            }

            const callback = function (mutationsList, observer) {
                console.log("joku mutaatio", mutationsList)
                
                translatedText.push($("#translation-to").html())
                console.log("ajax it")
                observer.disconnect();
                HandleParts(parts, ++j)
            };

            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);

            target.value = parts[j]
            target.dispatchEvent(new Event('keyup'));
            

            //
        }

        $.ajax({
                url: server + "/" + chap._id,
                success: function (result) {
                    console.log(result)
                    if (result.content && result.content.length > 0) {
                        var parts = SplitTxt(result.content);
                        HandleParts(parts)
                        //target.value = part
                        //target.dispatchEvent(new Event('keyup'));
                    }

                },
                type: 'get',
                async: false
            });




    };

    function SplitTxt(text) {
        var limit = 1000
        var arr = text.split("\n")
        var ret = []
        var str = ""

        arr.forEach((i) => {
            if (str.length + i.length < limit) {
                str += i + "\n"
            } else {
                arr.push(str)
                str = i
            }
        })

        ret.push(str)


        return ret
    }

})();