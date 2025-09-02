# Playlist API (Spring Boot + JPA + H2 + Security)

**Cómo ejecutar**

```bash
mvn spring-boot:run
```

**Credenciales por defecto**

- user/user123 (ROLE_USER) → puede crear y leer.
- admin/admin123 (ROLE_ADMIN) → además puede eliminar.

**Endpoints**

- `POST /lists` → 201 Created + Location (valida nombre no nulo/no blanco → 400)
- `GET /lists` → 200 OK
- `GET /lists/{listName}` → 200 OK o 404 si no existe
- `DELETE /lists/{listName}` → 204 No Content o 404 si no existe (solo ADMIN)

**Swagger/OpenAPI**: `http://localhost:8080/swagger-ui/index.html`

**H2 Console**: `http://localhost:8080/h2-console`



### Authors
- [@danieleduardc](https://github.com/danieleduardc)