package com.toyota.backend.repository;

import com.toyota.backend.entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findByClientId(Long clientId);
    Optional<Vehicule> findByImmatriculation(String immatriculation);
    List<Vehicule> findByMarqueContaining(String marque);
    List<Vehicule> findByModeleContaining(String modele);
    
    @Query("SELECT v FROM Vehicule v WHERE v.client.id = :clientId ORDER BY v.id DESC")
    List<Vehicule> findVehiculesByClientId(@Param("clientId") Long clientId);
}