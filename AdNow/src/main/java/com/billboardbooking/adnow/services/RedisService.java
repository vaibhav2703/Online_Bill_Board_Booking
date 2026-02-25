package com.billboardbooking.adnow.services;

import com.billboardbooking.adnow.entity.Billboard;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class RedisService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public <T> T getCache(String key) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            return value == null ? null : (T) value;
        } catch (Exception e) {
            log.error("Error while getting cache for key {}: {}", key, String.valueOf(e));
            e.printStackTrace();
            return null;
        }
    }

    public <T> void setCache(String key, T data, Long ttl) {
        try {
            redisTemplate.opsForValue().set(key, data, ttl, TimeUnit.SECONDS);
            log.info("Cache set successfully for key: {}", key);
        } catch (Exception e) {
            log.error("Error while setting cache for key {}: {}", key, e.getMessage());
        }
    }

    // Add delete method for cache invalidation
    public void deleteCache(String key) {
        try {
            redisTemplate.delete(key);
            log.info("Cache deleted successfully for key: {}", key);
        } catch (Exception e) {
            log.error("Error while deleting cache for key {}: {}", key, e.getMessage());
        }
    }

    // Optional: Delete multiple keys at once
    public void deleteCachePattern(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            if (!keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("Deleted {} cache entries matching pattern: {}", keys.size(), pattern);
            }
        } catch (Exception e) {
            log.error("Error while deleting cache pattern {}: {}", pattern, e.getMessage());
        }
    }
}
