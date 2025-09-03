# Playlist App - Sistema Full Stack
### (Spring Boot + JPA + H2 + Security + Angular)

## 🚀 Cómo ejecutar backend + frontend

```bash
cd playlist-api
mvn spring-boot:run
```

```bash
cd playlist-client
npm install
ng serve
```

## 🔑 Credenciales por defecto

- **user / user123** → ROLE_USER → puede **crear** y **leer** playlists.
- **admin / admin123** → ROLE_ADMIN → además puede **eliminar** playlists.

## 📂 Estructura del proyecto
**Backend**

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

**Frontend**
```plaintext
playlist-frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes Angular
│   │   ├── services/           # Servicios HTTP y lógica
│   │   ├── models/             # Interfaces y tipos
│   │   └── auth/               # Autenticación y guards
│   ├── assets/                 # Recursos estáticos
│   └── environments/           # Configuración por entorno
├── package.json                # Dependencias npm
└── angular.json                # Configuración Angular
```
## 📌 Endpoints API REST

- `POST /lists` → **201 Created** , Location(valida nombre null → **400 Bad Request**)
- `GET /lists` → **200 OK**
- `GET /lists/{listName}` → **200 OK** o **404 Not Found**
- `DELETE /lists/{listName}` → **204 No Content** o **404 Not Found** (solo ADMIN)

## 🌐 URLs de acceso

**Backend**

- API → http://localhost:8080
- Swagger/OpenAPI → http://localhost:8080/swagger-ui/index.html
- H2 Console → http://localhost:8080/h2-console

**Frontend**

- Aplicación Angular → http://localhost:4200
