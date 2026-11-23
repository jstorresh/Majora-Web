# DESPERTAR — Máscara de Majora Interactiva

Sitio web hipermedia de un wearable que reacciona a la proximidad: **ESP32 + sensor ultrasónico HC-SR04 + 2 servos** que mueven los ojos de una máscara según la distancia de la persona.

## Estados
| Estado | Distancia | Ojos (servos) |
|---|---|---|
| Dormida | más de 80 cm | 90° / 90° |
| Despertar | 30–80 cm | 65° / 115° |
| Posesión | 30 cm o menos | 45° / 135° |
| Calma | 5 s sin presencia cercana | retorno a 90° / 90° |

## Contenido del sitio
- Portada con radar animado y máscara hecha de franjas.
- Simulación de estados (deslizador de distancia).
- Tecnología, circuito y código base del ESP32.
- Anatomía guiada por scroll y visor de 4 vistas del modelo 3D.

## Cómo verlo
Abre `index.html` en el navegador (necesita internet para Google Fonts y Anime.js).
Opcional: guarda Anime.js v4 en `vendor/anime.umd.min.js` (ver `vendor/LEEME.txt`); si falta, se carga desde jsDelivr.

## Tecnologías
HTML, CSS y JavaScript sin dependencias de build · [Anime.js v4](https://animejs.com/)

> La simulación es visual y no está conectada al sensor físico.
