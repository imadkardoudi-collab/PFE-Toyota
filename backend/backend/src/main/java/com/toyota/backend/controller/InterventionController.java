package com.toyota.backend.controller;

import com.toyota.backend.entity.Intervention;
import com.toyota.backend.repository.InterventionRepository;
import com.toyota.backend.service.InterventionService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin(origins = "http://localhost:4200")
public class InterventionController {

    private final InterventionService interventionService;
    private final InterventionRepository interventionRepository;

    public InterventionController(InterventionService interventionService, InterventionRepository interventionRepository) {
        this.interventionService = interventionService;
        this.interventionRepository = interventionRepository;
    }

    // GET ALL
    @GetMapping
    public List<Intervention> getAllInterventions() {
        return interventionService.getAllInterventions();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Intervention getIntervention(@PathVariable Long id) {
        return interventionService.getInterventionById(id);
    }

    // POST - Create with validation
    @PostMapping
    public Intervention createIntervention(@Valid @RequestBody Intervention intervention) {
        return interventionService.saveIntervention(intervention);
    }

    // PUT - Update intervention
    @PutMapping("/{id}")
    public Intervention updateIntervention(@PathVariable Long id, @Valid @RequestBody Intervention intervention) {
        return interventionService.updateIntervention(id, intervention);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteIntervention(@PathVariable Long id) {
        interventionService.deleteIntervention(id);
    }

    // Get interventions by vehicule
    @GetMapping("/vehicule/{vehiculeId}")
    public List<Intervention> getByVehicule(@PathVariable Long vehiculeId) {
        return interventionService.getInterventionsByVehicule(vehiculeId);
    }

    // Get interventions by type
    @GetMapping("/type/{type}")
    public List<Intervention> getByType(@PathVariable String type) {
        return interventionService.getInterventionsByType(type);
    }

    // Get interventions by status
    @GetMapping("/status/{status}")
    public List<Intervention> getByStatus(@PathVariable String status) {
        return interventionService.getInterventionsByStatus(status);
    }

    // Get interventions by date range
    @GetMapping("/daterange")
    public List<Intervention> getByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return interventionService.getInterventionsByDateRange(startDate, endDate);
    }

    // Get total revenue
    @GetMapping("/stats/revenue")
    public Double getTotalRevenue() {
        return interventionService.getTotalRevenue();
    }

    // Get monthly revenue
    @GetMapping("/stats/revenue/monthly/{yearMonth}")
    public Double getMonthlyRevenue(@PathVariable String yearMonth) {
        YearMonth ym = YearMonth.parse(yearMonth);
        return interventionService.getMonthlyRevenue(ym);
    }

    // Get monthly intervention count
    @GetMapping("/stats/count/monthly/{yearMonth}")
    public Long getMonthlyCount(@PathVariable String yearMonth) {
        YearMonth ym = YearMonth.parse(yearMonth);
        return interventionService.getMonthlyInterventionCount(ym);
    }

    // Get recent interventions (last 10)
    @GetMapping("/recent")
    public List<Intervention> getRecentInterventions() {
        return interventionService.getRecentInterventions();
    }
}