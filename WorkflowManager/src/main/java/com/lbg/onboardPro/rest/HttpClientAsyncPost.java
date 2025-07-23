package com.lbg.onboardPro.rest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class HttpClientAsyncPost {
	
	/**
	 * Method to send an asynchronous POST request.
	 * 
	 * @param url     The URL to which the POST request is sent.
	 * @param payload The data to be sent in the POST request.
	 * @return 
	 */
	public static String sendPostRequest(String url, String jsonBody) {
		
		HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        CompletableFuture<HttpResponse<String>> responseFuture = HttpClient.newHttpClient().sendAsync(request, HttpResponse.BodyHandlers.ofString());

        
        return responseFuture.thenApply(HttpResponse::body).join();
	}

}
