package demo.playlist_api.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("Playlist API")
                        .description("Prueba Java - API de listas de reproducción")
                        .version("v1"))
                .externalDocs(new ExternalDocumentation()
                        .description("Repo")
                        .url("https://demo.com"));
    }
}