package com.toyota.backend.repository;

import com.toyota.backend.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByVehiculeId(Long vehiculeId);
    
    @Query("SELECT i FROM Intervention i WHERE i.dateIntervention BETWEEN :d1 AND :d2 ORDER BY i.dateIntervention DESC")
    List<Intervention> findByDateBetween(@Param("d1") LocalDate d1, @Param("d2") LocalDate d2);
    
    List<Intervention> findByTypeIntervention(String typeIntervention);
    List<Intervention> findByStatut(String statut);
    
    @Query("SELECT SUM(i.cout) FROM Intervention i")
    Double getTotalRevenue();
    
    @Query("SELECT SUM(i.cout) FROM Intervention i WHERE YEAR(i.dateIntervention) = :year AND MONTH(i.dateIntervention) = :month")
    Double getMonthlyRevenue(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT COUNT(i) FROM Intervention i WHERE YEAR(i.dateIntervention) = :year AND MONTH(i.dateIntervention) = :month")
    Long getMonthlyInterventionCount(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT i FROM Intervention i WHERE i.dateIntervention = :date ORDER BY i.id DESC")
    List<Intervention> findByDateIntervention(@Param("date") LocalDate date);

    @Query("SELECT MONTH(i.dateIntervention), COUNT(i) FROM Intervention i GROUP BY MONTH(i.dateIntervention)")
    List<Object[]> countInterventionsByMonth();

    @Query("SELECT i.statut, COUNT(i) FROM Intervention i GROUP BY i.statut")
    List<Object[]> countByStatus();

    @Query("SELECT SUM(i.prix) FROM Intervention i")
    Double totalRevenue();
}