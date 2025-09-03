# Playlist API (Spring Boot + JPA + H2 + Security)

## 🚀 Cómo ejecutar

```bash
mvn spring-boot:run
```

## 🔑 Credenciales por defecto

- **user / user123** → ROLE_USER → puede **crear** y **leer** playlists.
- **admin / admin123** → ROLE_ADMIN → además puede **eliminar** playlists.

## 📂 Estructura del proyecto

```plaintext
playlist-api/
├── src/
│   ├── main/
│   │   ├── java/demo/playlist_api/
│   │   │   ├── config/          # Configuración de seguridad y beans
│   │   │   ├── domain/          # Entidades JPA (Playlist, Song)
│   │   │   ├── repository/      # Interfaces JPA Repository
│   │   │   ├── service/         # Lógica de negocio
│   │   │   ├── web/             # Controladores REST + DTOs
│   │   │   └── PlaylistApiApp.java # Clase principal (Spring Boot)
│   │   └── resources/
│   │       ├── application.properties  # Configuración de DB, puertos, seguridad
│   └── test/
│       └── java/demo/playlist_api/
│           └── PlaylistControllerTest.java # Pruebas de integración con MockMvc
└── pom.xml                      # Dependencias y configuración del proyecto
```

## 📌 Endpoints principales

- `POST /lists` → **201 Created** , Location(valida nombre null → **400 Bad Request**)
- `GET /lists` → **200 OK**
- `GET /lists/{listName}` → **200 OK** o **404 Not Found**
- `DELETE /lists/{listName}` → **204 No Content** o **404 Not Found** (solo ADMIN)

## 📖 Documentación y herramientas

- **Swagger/OpenAPI** → [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **H2 Console** → [http://localhost:8080/h2-console](http://localhost:8080/h2-console)  
