package com.toyota.backend.repository;

import com.toyota.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNomContaining(String nom);
    List<Client> findByPrenomContaining(String prenom);
    Optional<Client> findByCin(String cin);
    List<Client> findByTelephoneContaining(String telephone);
    
    @Query("SELECT c FROM Client c WHERE LOWER(c.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR c.cin LIKE CONCAT('%', :searchTerm, '%') " +
           "OR c.telephone LIKE CONCAT('%', :searchTerm, '%')")
    List<Client> searchClients(@Param("searchTerm") String searchTerm);
}