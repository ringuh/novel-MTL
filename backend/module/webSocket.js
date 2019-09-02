module.exports = {
    init: () => {
        let connections = []
        var WebSocketServer = require('websocket').server;
        var http = require('http');
        
        const scraper = require("./scraper")
        
        var server = http.createServer((request, response) => {
            // process HTTP request. Since we're writing just WebSockets
            // server we don't have to implement anything.
        });

        server.listen(1337, () => { console.log("listening to ws") });

        // create the server
        wsServer = new WebSocketServer({
            httpServer: server
        });

        // WebSocket server
        wsServer.on('request', (request) => {
            var websocket = request.accept(null, request.origin);
            //connections.push(connection)
            websocket.on('message', function (message) {
                var msg = message.type === 'utf8' ? JSON.parse(message.utf8Data): {}
                
                if(msg.cmd == "scrape")
                    scraper(msg, websocket)

                //websocket.sendUTF(JSON.stringify({ msg: "reply from WS. Sockets "+ connections.length, data: msg }))
                
            });

            websocket.on('close', function (connection) {
                // close user connection
                console.log("WS connection closed")
            });
        });
    }
}