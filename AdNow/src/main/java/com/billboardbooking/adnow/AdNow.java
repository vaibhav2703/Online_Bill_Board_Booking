package com.billboardbooking.adnow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AdNow {

	public static void main(String[] args) {
		SpringApplication.run(AdNow.class, args);
	}

}
