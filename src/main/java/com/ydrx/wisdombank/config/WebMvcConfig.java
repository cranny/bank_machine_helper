package com.ydrx.wisdombank.config;

import org.springframework.boot.autoconfigure.web.WebMvcRegistrationsAdapter;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@Configuration
@ComponentScan
public class WebMvcConfig extends WebMvcRegistrationsAdapter {

	public void addResourceHandlers(final ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/static/**").addResourceLocations("/static/");
		registry.addResourceHandler("/*.html", "/**.ico").addResourceLocations("/");

	}

	protected void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/").setViewName("forward:/index.html");
	}

	protected void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("*").allowCredentials(true)
				.allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS").maxAge(3600);
	}

}