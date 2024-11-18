package site.whatsapp;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@Slf4j
@EnableCaching
public class WhatsAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(WhatsAppApplication.class, args);
        log.info("\n\n\t\t\t\t\t\t\t\t\tSTART!!!");
        log.info("API test: http://localhost:5000/swagger-ui/index.html");
    }

}
