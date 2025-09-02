package demo.playlist_api;

import demo.playlist_api.web.dto.PlaylistDto;
import demo.playlist_api.web.dto.SongDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class PlaylistControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    private String basicAuth(String u, String p){return "Basic " + java.util.Base64.getEncoder().encodeToString((u+":"+p).getBytes());}

    @Test
    void fullFlow() throws Exception {
        var dto = new PlaylistDto("Lista 1", "Descripción", Set.of(new SongDto("Song","Artist","Album","2024","Pop")));
        mvc.perform(post("/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", basicAuth("user","user123"))
                        .content(om.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"));

        mvc.perform(get("/lists")
                        .header("Authorization", basicAuth("user","user123")))
                .andExpect(status().isOk());

        mvc.perform(get("/lists/Lista 1")
                        .header("Authorization", basicAuth("user","user123")))
                .andExpect(status().isOk());

        mvc.perform(delete("/lists/Lista 1")
                        .header("Authorization", basicAuth("admin","admin123")))
                .andExpect(status().isNoContent());
    }
}