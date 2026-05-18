package com.Reco.backend.repository;

import com.Reco.backend.model.Product;
import com.Reco.backend.model.User;
import com.Reco.backend.model.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {

    List<UserInteraction> findAllByUser(User user);

    List<UserInteraction> findAllByProduct(Product product);

    @Query("SELECT DISTINCT u.product.id FROM UserInteraction u WHERE u.user.id = :userId")
    List<Long> findDistinctProductIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT u.user FROM UserInteraction u")
    List<User> findDistinctUsers();

}
