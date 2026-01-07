# Taller de Pruebas de Carga y Rendimiento con k6

Este proyecto es parte del taller de pruebas de software. Contiene un servidor de API simple y un script de pruebas de rendimiento utilizando **k6**.

## Estructura del Proyecto

- `server.js`: Servidor Express con endpoints de prueba (`/api/test` y `/api/data`).
- `carga-y-rendimiento.js`: Script de k6 que simula carga de usuarios virtuales.
- `RESULTADOS_K6.md`: Análisis detallado de los resultados obtenidos.

## Requisitos

- [Node.js](https://nodejs.org/)
- [k6](https://k6.io/docs/getting-started/installation/)

## Cómo utilizarlo

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor
```bash
npm start
```
El servidor estará disponible en `http://localhost:3333`.

### 3. Ejecutar las pruebas de carga
En otra terminal, ejecuta:
```bash
npm run test:k6
```

