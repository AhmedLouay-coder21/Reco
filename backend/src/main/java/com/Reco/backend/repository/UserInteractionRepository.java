package com.Reco.backend.repository;

import com.Reco.backend.model.User;
import com.Reco.backend.model.Product;
import com.Reco.backend.model.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {

    List<UserInteraction> findAllByUser(User user);
    
    List<UserInteraction> findAllByProduct(Product product);
}
