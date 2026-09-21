package com.musify.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    public DataInitializer() {
    }

    @Override
    public void run(String... args) throws Exception {
        // All demo data removed.
        // Data is dynamically managed by registered users and synchronized with Supabase.
    }
}
