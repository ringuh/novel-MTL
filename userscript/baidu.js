// ==UserScript==
// @name         baidu translator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.9lessons.info/2013/04/play-notification-sound-using-jquery.html
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    const transBtn = document.getElementById("translate-button");
    const target = document.querySelector('textarea')

    var splitText = "";
    var lastIndex = 0;
    var oldText = "WANHA";


    function transBtnClick(){
        setTimeout(() => {
            transBtn.click();
            transBtn.scrollIntoView();
        }, 500);
    }
    function SplitTxt(text){
        console.log("last index", lastIndex);

        var initIndex = lastIndex;
        lastIndex = text.indexOf("\n", lastIndex)

        
        while(lastIndex > -1)
        {
            var nextIndex = text.indexOf("\n", lastIndex+1)
            if( nextIndex-initIndex > 1500 && text.length - initIndex > 1850 ){
                console.log("return shallow", lastIndex, initIndex, lastIndex-initIndex)

                return text.substr(initIndex, lastIndex - initIndex) + "\n"+lastIndex+" / "+text.length;
            }
            lastIndex = nextIndex;
           
        }
        console.log("return all", initIndex, text.length, text.length-initIndex)
        lastIndex = 0;
        return text.substr(initIndex, text.length);
    }
    target.addEventListener('paste', (event) => {
        console.log(event);
        target.value = "";

        transBtnClick();

    });
   target.addEventListener('click', (e)=>{
       navigator.clipboard.readText()
           .then((text)=>{
           if(text!=oldText){ lastIndex = 0 };
           oldText = text;
           target.value = SplitTxt(text);
           //target.value = text;
           transBtnClick();
       });
   });


    function Obsaa(){
        // Select the node that will be observed for mutations
        //const targetNode = document.getElementById('translation-to');
        const targetNode = document.getElementsByClassName("trans-right")[0];
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            console.log("joku mutaatio", mutationsList)

        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        //observer.disconnect();
    }
    Obsaa();
})();