> A simple js library that helps you find devices on your network

Detects:

- CircuitPython boards
- Routers

[Usage example](https://github.com/sensei-alex/scan/blob/main/scan.html)
[Live demo](https://snlx.net/scan/scan.html)

## Limitations

- Does not work if your site uses HTTPS. You can get around that by making the scanner downloadable, for example
- If the device doesn't want you to connect, this library will not help you. It only scans port 80 and if it gets back a CORS error it does nothing about it
