const express = require('express');
const app = express();
const port = 3333;

app.use(express.json());

// Ruta raíz para confirmar que el servidor está activo
app.get('/', (req, res) => {
    res.status(200).send('Servidor K6 activo y escuchando en el puerto 3333');
});

// Ruta GET para simular una respuesta simple con retraso aleatorio
app.get('/api/test', (req, res) => {
    // Simulamos un retardo aleatorio de hasta 500 ms (para pruebas de rendimiento)
    const delay = Math.floor(Math.random() * 501);
    setTimeout(() => {
        res.status(200).json({
            message: "Respuesta GET exitosa",
            delay: `${delay}ms`
        });
    }, delay);
});

// Ruta POST para recibir datos y responder con lo recibido
app.post('/api/data', (req, res) => {
    const receivedData = req.body;
    res.status(201).json({
        message: "Datos recibidos",
        data: receivedData
    });
});

// Iniciamos el servidor escuchando en todas las interfaces del puerto especificado
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
