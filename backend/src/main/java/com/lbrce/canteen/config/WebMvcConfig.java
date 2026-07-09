package com.lbrce.canteen.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Serves uploaded food images from the classpath at {@code /uploads/**}.
 *
 * Files are written to {@code src/main/resources/static/uploads/} by
 * {@code FileUploadController} so that they are available both at runtime
 * (from the classpath) and packaged inside the JAR.
 *
 * In production you would likely point this at a real disk path or CDN.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("classpath:/static/uploads/", "file:./uploads/");
    }
}
