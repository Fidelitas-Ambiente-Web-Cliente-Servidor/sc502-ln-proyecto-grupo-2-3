# Parkeate

Plataforma web para localizar, comparar, reservar y administrar espacios de parqueo.

## Estructura del proyecto

```text
app/
  config/ controllers/ models/ repositories/ services/ middleware/ helpers/
database/
  schema/ migrations/ seed/
docker/
  php/ mysql/
public/
  css/ images/ js/ pages/ index.html
uploads/
includes/
```

El Front-End se sirve actualmente desde `public/` y conserva `index.html` durante esta etapa. Las carpetas de `app/`, `database/`, `docker/`, `includes/` y `uploads/` preparan la futura incorporación gradual de PHP, MySQL y Docker; todavía no contienen una implementación de backend.

## Estado actual

- HTML, CSS, Bootstrap y JavaScript Vanilla.
- Persistencia temporal mediante LocalStorage.
- Sin PHP, Docker, MySQL ni API activa en esta fase.
