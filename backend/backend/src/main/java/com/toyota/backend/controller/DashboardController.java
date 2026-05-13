package com.toyota.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import com.toyota.backend.service.DashboardService;
import com.toyota.backend.entity.Intervention;
import com.toyota.backend.repository.ClientRepository;
import com.toyota.backend.repository.VehiculeRepository;
import com.toyota.backend.repository.InterventionRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ClientRepository clientRepo;
    private final VehiculeRepository vehiculeRepo;
    private final InterventionRepository interventionRepo;

    public DashboardController(DashboardService dashboardService,
                               ClientRepository clientRepo,
                               VehiculeRepository vehiculeRepo,
                               InterventionRepository interventionRepo) {
        this.dashboardService = dashboardService;
        this.clientRepo = clientRepo;
        this.vehiculeRepo = vehiculeRepo;
        this.interventionRepo = interventionRepo;
    }

    // Get general dashboard stats
    @GetMapping
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalClients", dashboardService.getTotalClients());
        stats.put("totalVehicules", dashboardService.getTotalVehicules());
        stats.put("totalInterventions", dashboardService.getTotalInterventions());
        stats.put("totalRevenue", dashboardService.getRevenue());

        return stats;
    }

    // Get current month statistics
    @GetMapping("/stats/current-month")
    public Map<String, Object> getCurrentMonthStats() {
        return dashboardService.getCurrentMonthStats();
    }

    // Get monthly statistics for specific month
    @GetMapping("/stats/monthly/{yearMonth}")
    public Map<String, Object> getMonthlyStats(@PathVariable String yearMonth) {
        YearMonth ym = YearMonth.parse(yearMonth);
        return dashboardService.getMonthlyStats(ym);
    }

    // Get recent interventions (last 10)
    @GetMapping("/recent-interventions")
    public List<Intervention> getRecentInterventions() {
        return dashboardService.getRecentInterventions();
    }

    // Get total counts for all entities
    @GetMapping("/counts")
    public Map<String, Long> getCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("clients", clientRepo.count());
        counts.put("vehicules", vehiculeRepo.count());
        counts.put("interventions", interventionRepo.count());
        return counts;
    }

    @GetMapping("/stats/month")
    public List<Object[]> getByMonth() {
        return interventionRepository.countInterventionsByMonth();
  }

    @GetMapping("/stats/status")
    public List<Object[]> getByStatus() {
        return interventionRepository.countByStatus();
    }

    @GetMapping("/stats/revenue")
    public Double getRevenue() {
        return interventionRepository.totalRevenue();
    }
}