package com.lbrce.canteen.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Serves the React entrypoint for direct links such as /student/orders. */
@Controller
public class SpaForwardController {

    @GetMapping({"/login", "/signup", "/student/**", "/staff/**", "/admin/**"})
    public String forwardToSpa() {
        return "forward:/index.html";
    }
}
