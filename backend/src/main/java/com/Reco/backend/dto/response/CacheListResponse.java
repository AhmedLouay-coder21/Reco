package com.Reco.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CacheListResponse {

    private long total;
    private List<CacheEntryResponse> cacheEntries;

}
