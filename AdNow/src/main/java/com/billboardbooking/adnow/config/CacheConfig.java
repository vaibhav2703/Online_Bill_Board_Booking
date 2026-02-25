package com.billboardbooking.adnow.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        // Simple in-memory cache for UserDetails
        // This cache is per-request and prevents multiple DB hits
        // within the same request for the same user
        return new ConcurrentMapCacheManager("userCache");
    }
}
