package com.billboardbooking.adnow.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate redisTemplate = new RedisTemplate();
        redisTemplate.setConnectionFactory(connectionFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        return redisTemplate;
    }

    @Bean
    @Primary
    public RedisTemplate<String, Object> jsonRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.registerModule(new Jdk8Module()); // Support for Optional types
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Enable default typing to preserve class information during serialization
        // This fixes the LinkedHashMap cast error by storing type metadata in JSON
        mapper.activateDefaultTyping(
                mapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                com.fasterxml.jackson.annotation.JsonTypeInfo.As.PROPERTY);

        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(mapper);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(serializer);
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(serializer);

        redisTemplate.afterPropertiesSet();

        return redisTemplate;
    }
}
