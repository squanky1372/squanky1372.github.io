import tornado.ioloop
import tornado.web
import tornado.websocket

website_clients = []

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self,origin):
        return True
    def open(self):
        print("Websocket opened")
        website_clients.append(self)

    def on_message(self, message):
        self.write_message(u"You said: " + message)

    def on_close(self):
        print("Websocket closed")
        website_clients.remove(self)

class WebSocketHandlerESP32(tornado.websocket.WebSocketHandler):
    def check_origin(self,origin):
        return True
    def open(self):
        print("Websocket opened")

    def on_message(self, message):
        self.write_message(u"Hi ESP32! Here's what you said: " + message)
        update_all_clients(message)

    def on_close(self):
        print("Websocket closed")

def update_all_clients(val):
    for client in website_clients:
        client.write_message(val)

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/websocket", WebSocketHandler),
        (r"/websocket_esp32", WebSocketHandlerESP32)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server started local 8888:")
    tornado.ioloop.IOLoop.current().start()