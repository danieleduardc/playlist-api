package demo.playlist_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

/**
 * Configuración de seguridad para la aplicación.
 * Define la cadena de filtros de seguridad, el servicio de detalles de usuario y el codificador de contraseñas.
 */
@Configuration
public class SecurityConfig {

    /**
     * Configura la cadena de filtros de seguridad HTTP.
     * - Deshabilita CSRF.
     * - Configura CORS para permitir solicitudes desde http://localhost:4200.
     * - Define las reglas de autorización para los puntos finales.
     * - Habilita la autenticación básica HTTP.
     * @param http El objeto HttpSecurity para configurar.
     * @return La cadena de filtros de seguridad construida.
     * @throws Exception si ocurre un error durante la configuración.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var c = new CorsConfiguration();
                    c.setAllowedOrigins(List.of("http://localhost:4200"));
                    c.setAllowedMethods(List.of("GET","POST","DELETE"));
                    c.setAllowedHeaders(List.of("Authorization","Content-Type"));
                    c.setAllowCredentials(true);
                    return c;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/lists/**").hasRole("ADMIN")
                        .requestMatchers("/lists/**").authenticated()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    /**
     * Crea un servicio de detalles de usuario en memoria con dos usuarios: 'user' y 'admin'.
     * @param encoder El codificador de contraseñas para codificar las contraseñas de los usuarios.
     * @return Un UserDetailsService con los usuarios predefinidos.
     */
    @Bean
    public UserDetailsService uds(PasswordEncoder encoder) {
        var user = User.withUsername("user").password(encoder.encode("user123")).roles("USER").build();
        var admin = User.withUsername("admin").password(encoder.encode("admin123")).roles("USER","ADMIN").build();
        return new InMemoryUserDetailsManager(user, admin);
    }

    /**
     * Proporciona un bean de codificador de contraseñas que utiliza BCrypt.
     * @return Un PasswordEncoder que utiliza el algoritmo BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}