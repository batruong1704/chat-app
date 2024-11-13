package site.whatsapp;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class WhatsAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(WhatsAppApplication.class, args);
        log.info("\n\n\t\t\tSTART!!!");
        log.info("API test: http://localhost/swagger-ui/index.html");
    }

}
