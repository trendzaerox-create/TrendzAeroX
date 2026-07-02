package com.mydev.ecommerce.shipment.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ShiprocketClient {

    private final RestClient shiprocketRestClient;

    private final ShiprocketProperties properties;

    private volatile String cachedToken;

    private volatile OffsetDateTime cachedTokenExpiresAt;

    public JsonNode createOrder(
            Map<String, Object> payload
    ) {
        return postWithAuth(
                "/v1/external/orders/create/adhoc",
                payload
        );
    }

    public JsonNode assignAwb(
            Long shipmentId,
            Integer courierId
    ) {
        Map<String, Object> payload =
                new LinkedHashMap<>();

        payload.put(
                "shipment_id",
                shipmentId
        );

        if (courierId != null) {
            payload.put(
                    "courier_id",
                    courierId
            );
        }

        return postWithAuth(
                "/v1/external/courier/assign/awb",
                payload
        );
    }

    public JsonNode generatePickup(
            Long shipmentId
    ) {
        Map<String, Object> payload =
                new LinkedHashMap<>();

        payload.put(
                "shipment_id",
                shipmentId
        );

        return postWithAuth(
                "/v1/external/courier/generate/pickup",
                payload
        );
    }

    private JsonNode postWithAuth(
            String path,
            Object payload
    ) {
        return postWithAuth(
                path,
                payload,
                true
        );
    }

    private JsonNode postWithAuth(
            String path,
            Object payload,
            boolean retryOnUnauthorized
    ) {
        try {
            return shiprocketRestClient
                    .post()
                    .uri(path)
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer " + getToken()
                    )
                    .body(payload)
                    .retrieve()
                    .body(JsonNode.class);

        } catch (RestClientResponseException exception) {
            if (
                    retryOnUnauthorized
                            && exception
                            .getStatusCode()
                            .value() == 401
            ) {
                clearToken();

                return postWithAuth(
                        path,
                        payload,
                        false
                );
            }

            throw buildApiException(
                    path,
                    exception
            );
        }
    }

    private synchronized String getToken() {
        if (
                cachedToken != null
                        && cachedTokenExpiresAt != null
                        && OffsetDateTime.now()
                        .isBefore(cachedTokenExpiresAt)
        ) {
            return cachedToken;
        }

        validateEnabledAndCredentials();

        Map<String, Object> payload =
                new LinkedHashMap<>();

        payload.put(
                "email",
                properties.getEmail().trim()
        );

        payload.put(
                "password",
                properties.getPassword()
        );

        try {
            JsonNode response =
                    shiprocketRestClient
                            .post()
                            .uri("/v1/external/auth/login")
                            .body(payload)
                            .retrieve()
                            .body(JsonNode.class);

            String token =
                    response != null
                            ? response.path("token").asText(null)
                            : null;

            if (
                    token == null
                            || token.isBlank()
            ) {
                throw new RuntimeException(
                        "Shiprocket auth token missing in response"
                );
            }

            cachedToken = token;

            cachedTokenExpiresAt =
                    OffsetDateTime
                            .now()
                            .plusHours(
                                    properties
                                            .getTokenValidHours()
                            );

            return cachedToken;

        } catch (RestClientResponseException exception) {
            throw buildApiException(
                    "/v1/external/auth/login",
                    exception
            );
        }
    }

    private void clearToken() {
        cachedToken = null;
        cachedTokenExpiresAt = null;
    }

    private void validateEnabledAndCredentials() {
        if (!properties.isEnabled()) {
            throw new RuntimeException(
                    "Shiprocket integration is disabled. "
                            + "Set SHIPROCKET_ENABLED=true."
            );
        }

        if (
                properties.getEmail() == null
                        || properties.getEmail().isBlank()
        ) {
            throw new RuntimeException(
                    "SHIPROCKET_EMAIL is missing"
            );
        }

        if (
                properties.getPassword() == null
                        || properties.getPassword().isBlank()
        ) {
            throw new RuntimeException(
                    "SHIPROCKET_PASSWORD is missing"
            );
        }
    }

    private RuntimeException buildApiException(
            String path,
            RestClientResponseException exception
    ) {
        String responseBody =
                exception.getResponseBodyAsString();

        if (
                responseBody != null
                        && responseBody.length() > 1000
        ) {
            responseBody =
                    responseBody.substring(0, 1000);
        }

        return new RuntimeException(
                "Shiprocket API failed -> "
                        + path
                        + " ["
                        + exception.getStatusCode()
                        + "] "
                        + responseBody,
                exception
        );
    }
}
