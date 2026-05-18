package com.Reco.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CacheEntryResponse {

    private Long cacheId;
    private Long userId;
    private int productCount;
    private Instant cachedAt;
    private Instant expiresAt;

}
