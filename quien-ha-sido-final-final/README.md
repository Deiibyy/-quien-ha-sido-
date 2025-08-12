
QUIÉN HA SIDO - PAQUETE FINAL (LISTO PARA SUBIR A RENDER)
-------------------------------------------------------

Contenido principal:
- index.html   -> Interfaz host (PC)
- mobile.html  -> Interfaz jugador (móvil)
- client.js    -> Lógica host (cliente Socket.io)
- mobile.js    -> Lógica móvil (cliente Socket.io)
- server.js    -> Servidor Node.js con Socket.io (salas, votos, fotos en memoria)
- style.css, mobile.css
- config.js    -> Lista de canciones (edítalo para poner tus MP3)
- public/music/ -> Pon aquí tus MP3 (nombres exactamente como en config.js)
- assets/ (imágenes, sonidos placeholder)
- README.md (este archivo)

PRUEBA LOCAL (antes de subir):
1) Instala Node.js si no lo tienes.
2) En la carpeta del proyecto abre terminal y ejecuta:
   npm init -y
   npm install express socket.io cors
3) Ejecuta el servidor:
   node server.js
4) Abre en tu PC:
   http://localhost:3000/index.html  (host)
   http://localhost:3000/mobile.html (móvil - o escanea el QR que el host genere)

AÑADIR TUS MP3:
- Copia tus archivos MP3 en public/music/
- Asegúrate de que los nombres coinciden con config.js
- Si usas nombres distintos, edita config.js para que coincidan.

DESPLIEGUE EN RENDER (recomendado para sockets):
1) Crea cuenta en https://render.com
2) Crea nuevo "Web Service" y conéctalo a GitHub o sube los archivos
3) Build command: npm install
4) Start command: node server.js
5) Deploy y tendrás URL pública. Abre /index.html en el host.

IMPORTANTE:
- No incluyo música con copyright. Añade tus MP3 en public/music/.
- Las fotos subidas se mantienen solo en memoria para la partida y no se guardan en disco.

Si quieres, te doy los pasos exactos para subir a GitHub y conectar con Render. 
