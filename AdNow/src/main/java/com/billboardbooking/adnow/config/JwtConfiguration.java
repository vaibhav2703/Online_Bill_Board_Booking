package com.billboardbooking.adnow.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt.secrete.key")
public class JwtConfiguration {
    public final String secreteKey;

    public JwtConfiguration(String secreteKey) {
        this.secreteKey = secreteKey;
    }

    public String getSecreteKey() throws Exception{
        if(StringUtils.isBlank(secreteKey) && secreteKey != null )
            return secreteKey;
        else
            throw new Exception();
    }
}
