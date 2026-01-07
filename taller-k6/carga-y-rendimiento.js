import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba (stages y thresholds)
export let options = {
    stages: [
        { duration: '30s', target: 100 }, // 1. Subida: de 0 a 20 usuarios en 30s
        { duration: '1m', target: 20 },  // 2. Meseta: mantener 20 usuarios por 1m
        { duration: '30s', target: 0 },  // 3. Bajada: de 20 a 0 usuarios en 30s
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // El 95% de las peticiones debe ser menor a 500ms
        http_req_failed: ['rate<0.01'],   // Menos del 1% de errores
    },
};

// Función principal que ejecutará cada VU (Virtual User)
export default function () {
    // 1. Enviar una solicitud HTTP GET al endpoint de prueba
    let resGet = http.get('http://127.0.0.1:3333/api/test');

    // Validar la respuesta GET usando "check"
    check(resGet, {
        'GET status is 200': (r) => r.status === 200,
        'GET has correct message': (r) => {
            try {
                return r.body && JSON.parse(r.body).message === "Respuesta GET exitosa";
            } catch (e) {
                return false;
            }
        },
    });

    // 2. Enviar una solicitud HTTP POST al endpoint de datos
    const payload = JSON.stringify({
        user: "Tester k6",
        message: "Probando el metodo POST",
        timestamp: new Date().toISOString()
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let resPost = http.post('http://127.0.0.1:3333/api/data', payload, params);

    // Validar la respuesta POST
    check(resPost, {
        'POST status is 201': (r) => r.status === 201,
        'POST returns correct message': (r) => {
            try {
                return r.body && JSON.parse(r.body).message === "Datos recibidos";
            } catch (e) {
                return false;
            }
        },
    });

    // Esperar 1 segundo antes de la siguiente iteración
    sleep(1);
}
