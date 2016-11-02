var Boom          = require("boom")
var HAPI          = require("hapi")
var HAPIWebSocket = require("hapi-plugin-websocket")

var server = new HAPI.Server()
server.connection({ address: "127.0.0.1", port: 3000 })
server.register(HAPIWebSocket, () => {

    /*  plain REST route  */
    server.route({
        method: "POST", path: "/foo",
        config: {
            payload: { output: "data", parse: true, allow: "application/json" },
        },
        handler: (request, reply) => {
            reply({ at: "foo", seen: request.payload })
        }
    })

    /*  combined REST/WebSocket route  */
    server.route({
        method: "POST", path: "/bar",
        config: {
            payload: { output: "data", parse: true, allow: "application/json" },
            plugins: { websocket: true }
        },
        handler: (request, reply) => {
            if (request.websocket())
                reply({ at: "bar", type: "websocket", seen: request.payload })
            else
                reply({ at: "bar", type: "rest", seen: request.payload })
        }
    })

    /*  exclusive WebSocket route  */
    server.route({
        method: "POST", path: "/baz",
        config: {
            plugins: { websocket: { only: true } }
        },
        handler: (request, reply) => {
            reply({ at: "baz", seen: request.payload })
        }
    })

    /*  full-featured exclusive WebSocket route  */
    server.route({
        method: "POST", path: "/quux",
        config: {
            plugins: {
                websocket: {
                    only: true,
                    create: (wss) => {
                        /* no-op */
                    },
                    connect: (wss, ws) => {
                        ws.send(JSON.stringify({ cmd: "WELCOME" }))
                        this.to = setInterval(() => {
                            ws.send(JSON.stringify({ cmd: "PING" }))
                        }, 5000)
                    },
                    disconnect: (wss, ws) => {
                        if (this.to !== null) {
                            clearTimeout(this.to)
                            this.to = null
                        }
                    }
                }
            }
        },
        handler: (request, reply) => {
            if (typeof request.payload.cmd !== "string")
                return reply(Boom.badRequest("invalid request"))
            if (request.payload.cmd === "PING")
                return reply({ result: "PONG" })
            else if (request.payload.cmd === "AWAKE-ALL") {
                var wss = request.websocket().wss
                wss.clients.forEach((ws) => {
                    ws.send(JSON.stringify({ cmd: "AWAKE" }))
                })
                return reply().code(204)
            }
            else
                return reply(Boom.badRequest("unknown command"))
        }
    })

    server.start()
})