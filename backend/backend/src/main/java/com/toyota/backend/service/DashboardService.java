package com.toyota.backend.service;

import org.springframework.stereotype.Service;
import com.toyota.backend.repository.*;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final VehiculeRepository vehiculeRepository;
    private final InterventionRepository interventionRepository;

    public DashboardService(ClientRepository clientRepository,
                            VehiculeRepository vehiculeRepository,
                            InterventionRepository interventionRepository) {
        this.clientRepository = clientRepository;
        this.vehiculeRepository = vehiculeRepository;
        this.interventionRepository = interventionRepository;
    }

    public long getTotalClients() {
        return clientRepository.count();
    }

    public long getTotalVehicules() {
        return vehiculeRepository.count();
    }

    public long getTotalInterventions() {
        return interventionRepository.count();
    }

    public double getRevenue() {
        Double revenue = interventionRepository.getTotalRevenue();
        return revenue != null ? revenue : 0;
    }

    // Get monthly statistics
    public Map<String, Object> getMonthlyStats(YearMonth yearMonth) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("revenue", interventionRepository.getMonthlyRevenue(yearMonth.getYear(), yearMonth.getMonthValue()));
        stats.put("interventionCount", interventionRepository.getMonthlyInterventionCount(yearMonth.getYear(), yearMonth.getMonthValue()));
        return stats;
    }

    // Get current month statistics
    public Map<String, Object> getCurrentMonthStats() {
        YearMonth currentMonth = YearMonth.now();
        return getMonthlyStats(currentMonth);
    }

    // Get recent interventions (last 10)
    public List<com.toyota.backend.entity.Intervention> getRecentInterventions() {
        return interventionRepository.findRecentInterventions();
    }
}