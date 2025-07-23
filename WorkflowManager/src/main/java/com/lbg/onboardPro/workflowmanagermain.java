package com.lbg.onboardPro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EntityScan(basePackages = "com.lbg.hr.entity")
public class workflowmanagermain {
	
	public static void main(String[] args) {
		SpringApplication.run(workflowmanagermain.class, args);
        System.out.println("Workflow Manager Application Started Successfully!");	}

}
