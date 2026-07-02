// package com.mydev.ecommerce.shipment.config;

// import org.springframework.boot.context.properties.EnableConfigurationProperties;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.web.client.RestClient;

// @Configuration
// @EnableConfigurationProperties(ShiprocketProperties.class)
// public class ShiprocketConfig {

//     @Bean
//     public RestClient shiprocketRestClient(
//             ShiprocketProperties properties
//     ) {
//         String baseUrl =
//                 properties.getBaseUrl() == null
//                         || properties.getBaseUrl().isBlank()
//                         ? "https://apiv2.shiprocket.in"
//                         : properties.getBaseUrl().trim();

//         return RestClient
//                 .builder()
//                 .baseUrl(baseUrl)
//                 .defaultHeader(
//                         HttpHeaders.CONTENT_TYPE,
//                         MediaType.APPLICATION_JSON_VALUE
//                 )
//                 .defaultHeader(
//                         HttpHeaders.ACCEPT,
//                         MediaType.APPLICATION_JSON_VALUE
//                 )
//                 .build();
//     }
// }


































package com.mydev.ecommerce.shipment.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestClient;

@Configuration
@EnableScheduling
@EnableConfigurationProperties(ShiprocketProperties.class)
public class ShiprocketConfig {

    @Bean
    public RestClient shiprocketRestClient(
            ShiprocketProperties properties
    ) {
        String baseUrl =
                properties.getBaseUrl() == null
                        || properties.getBaseUrl().isBlank()
                        ? "https://apiv2.shiprocket.in"
                        : properties.getBaseUrl().trim();

        return RestClient
                .builder()
                .baseUrl(baseUrl)
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }
}
