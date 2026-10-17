package com.lbrce.canteen.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

/**
 * Fallback resolver for Single Page Application client-side routing.
 * Any unmapped route that is NOT an API call, uploaded file, or static asset
 * is forwarded to index.html with HTTP 200 so React Router can handle it.
 */
@Configuration
public class SpaWebConfig implements ErrorViewResolver {

    @Override
    public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
        if (status == HttpStatus.NOT_FOUND) {
            String path = request.getRequestURI();
            // Don't forward API, file uploads, or static asset requests with extensions
            if (!path.startsWith("/api") && !path.startsWith("/uploads") && !path.contains(".")) {
                return new ModelAndView("forward:/index.html", HttpStatus.OK);
            }
        }
        return null;
    }
}
