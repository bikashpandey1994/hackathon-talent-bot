package com.lbg.onboardPro.rest;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

public class HttpClientAsyncPost {
    /**
     * Method to send a POST request using RestTemplate.
     *
     * @param url     The URL to which the POST request is sent.
     * @param jsonBody The data to be sent in the POST request.
     * @return Response body as String
     */
    public static String sendPostRequest(String url, String jsonBody) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        return restTemplate.postForObject(url, entity, String.class);
    }
}
