package com.toyota.backend.service;

import com.toyota.backend.entity.Intervention;
import com.toyota.backend.entity.Vehicule;
import com.toyota.backend.repository.InterventionRepository;
import com.toyota.backend.repository.VehiculeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final VehiculeRepository vehiculeRepository;

    public InterventionService(InterventionRepository interventionRepository,
                               VehiculeRepository vehiculeRepository) {
        this.interventionRepository = interventionRepository;
        this.vehiculeRepository = vehiculeRepository;
    }

    public List<Intervention> getAllInterventions() {
        return interventionRepository.findAll();
    }

    public Intervention saveIntervention(Intervention intervention) {
        try {

            if (intervention.getVehicule() == null || intervention.getVehicule().getId() == null) {
                throw new RuntimeException("Vehicule ID is required");
            }

            Long vehiculeId = intervention.getVehicule().getId();

            Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                    .orElseThrow(() -> new RuntimeException("Vehicule not found"));

            intervention.setVehicule(vehicule);
            
            // Set default status if not provided
            if (intervention.getStatut() == null) {
                intervention.setStatut("En attente");
            }

            return interventionRepository.save(intervention);

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Intervention updateIntervention(Long id, Intervention intervention) {
        Intervention existingIntervention = interventionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));

        existingIntervention.setDateIntervention(intervention.getDateIntervention());
        existingIntervention.setTypeIntervention(intervention.getTypeIntervention());
        existingIntervention.setDescription(intervention.getDescription());
        existingIntervention.setCout(intervention.getCout());
        existingIntervention.setStatut(intervention.getStatut());
        
        if (intervention.getTechnicien() != null) {
            existingIntervention.setTechnicien(intervention.getTechnicien());
        }

        return interventionRepository.save(existingIntervention);
    }

    public Intervention getInterventionById(Long id) {
        return interventionRepository.findById(id).orElse(null);
    }

    public void deleteIntervention(Long id) {
        interventionRepository.deleteById(id);
    }

    public List<Intervention> getInterventionsByVehicule(Long vehiculeId) {
        return interventionRepository.findByVehiculeId(vehiculeId);
    }

    public List<Intervention> getInterventionsByType(String type) {
        return interventionRepository.findByTypeIntervention(type);
    }

    public List<Intervention> getInterventionsByStatus(String statut) {
        return interventionRepository.findByStatut(statut);
    }

    public List<Intervention> getInterventionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return interventionRepository.findByDateBetween(startDate, endDate);
    }

    public Double getTotalRevenue() {
        return interventionRepository.getTotalRevenue();
    }

    public Double getMonthlyRevenue(YearMonth yearMonth) {
        Double revenue = interventionRepository.getMonthlyRevenue(yearMonth.getYear(), yearMonth.getMonthValue());
        return revenue != null ? revenue : 0.0;
    }

    public Long getMonthlyInterventionCount(YearMonth yearMonth) {
        Long count = interventionRepository.getMonthlyInterventionCount(yearMonth.getYear(), yearMonth.getMonthValue());
        return count != null ? count : 0L;
    }

    public List<Intervention> getRecentInterventions() {
        return interventionRepository.findRecentInterventions();
    }
}