package com.Reco.backend.repository;

import com.Reco.backend.model.BlackListedToken;
import com.Reco.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlackListedTokenRepository extends JpaRepository<BlackListedToken, Long> {

    Optional<BlackListedToken> findByTokenHash(String tokenHash);

    List<BlackListedToken> findAllByUser(User user);
}
