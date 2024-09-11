import http.server
import socketserver
import mysql.connector
import json

PORT = 8000

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/tipos':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            tipos = self.get_tipos_from_db()
            self.wfile.write(json.dumps(tipos).encode('utf-8'))
        else:
            super().do_GET()

    def get_tipos_from_db(self):
        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='seu_usuario',
                password='sua_senha',
                database='nome_do_banco_de_dados'
            )
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id, nome_tipo FROM tipos")
            tipos = cursor.fetchall()
            cursor.close()
            connection.close()
            return tipos
        except mysql.connector.Error as err:
            print(f"Erro ao conectar ao MySQL: {err}")
            return []

with socketserver.TCPServer(("", PORT), RequestHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
