package com.communication.mail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

//@SpringBootApplication (exclude = {DataSourceAutoConfiguration.class})
@SpringBootApplication
@ComponentScan(basePackages = "com.communication.mail")
@EnableJpaRepositories(basePackages = "com.communication.mail.repository")
@EnableScheduling
public class CommunicationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommunicationServiceApplication.class, args);
	}

}
