import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def open_browser():
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')

httpd = socketserver.TCPServer(('', PORT), MyHTTPRequestHandler)

print(f"🚀 Starting Adi-CodeVerse Server...")
print(f"📍 Server running at: http://localhost:{PORT}")
print(f"🌐 Opening browser in 1 second...")

threading.Thread(target=open_browser, daemon=True).start()

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n👋 Server stopped. Goodbye!")
    httpd.server_close()
