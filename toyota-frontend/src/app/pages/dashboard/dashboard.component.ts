import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { ClientService } from '../../services/client';
import { VehiculeService } from '../../services/vehicule';
import { InterventionService } from '../../services/intervention';
import { DashboardService } from '../../services/dashboard';
import { Client } from '../../models/client';
import { Vehicule } from '../../models/vehicule';
import { Intervention } from '../../models/intervention';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import 'chart.js/auto';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatPaginatorModule, NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  clients: Client[] = [];
  vehicules: Vehicule[] = [];
  interventions: Intervention[] = [];
  recentInterventions: Intervention[] = [];

  stats: any = {
    totalClients: 0,
    totalVehicules: 0,
    totalInterventions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyInterventions: 0
  };

  clientsChart: any = {
    labels: [],
    datasets: []
  };

  statusChart: any = {
    labels: [],
    datasets: []
  };

  // 📊 Bar Chart - Interventions per month
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Interventions',
        data: [12, 19, 8, 15, 22, 18, 25, 14, 19, 17, 21, 16],
        backgroundColor: '#CC0000'
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true
  };

  // 📈 Line Chart - Revenue trend
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Revenus (DH)',
        data: [4500, 5200, 4800, 6100, 7200, 6500],
        borderColor: '#CC0000',
        backgroundColor: 'rgba(204, 0, 0, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true
  };

  // 🥧 Pie Chart - Interventions by status
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Complétées', 'En cours', 'En attente'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: ['#51CF66', '#FFD93D', '#FF6B6B']
      }
    ]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true
  };

  revenue: number = 0;

  constructor(
    private clientService: ClientService,
    private vehiculeService: VehiculeService,
    private interventionService: InterventionService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentInterventions();
    this.loadCharts();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.totalClients = data.totalClients || 0;
        this.stats.totalVehicules = data.totalVehicules || 0;
        this.stats.totalInterventions = data.totalInterventions || 0;
        this.stats.totalRevenue = data.totalRevenue || 0;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });

    // Load current month stats
    this.dashboardService.getCurrentMonthStats().subscribe({
      next: (data) => {
        this.stats.monthlyRevenue = data.revenue || 0;
        this.stats.monthlyInterventions = data.interventionCount || 0;
      },
      error: (err) => {
        console.error('Error loading monthly stats:', err);
      }
    });
  }

  loadRecentInterventions() {
    this.interventionService.getRecentInterventions().subscribe({
      next: (data) => {
        this.recentInterventions = data;
      },
      error: (err) => {
        console.error('Error loading recent interventions:', err);
      }
    });
  }

  loadCharts() {
    this.dashboardService.getByMonth().subscribe(data => {
      this.clientsChart = {
        labels: data.map((d: any) => 'Mois ' + d[0]),
        datasets: [{
          data: data.map((d: any) => d[1]),
          label: 'Interventions'
        }]
      };
    });

    this.dashboardService.getByStatus().subscribe(data => {
      this.statusChart = {
        labels: data.map((d: any) => d[0]),
        datasets: [{
          data: data.map((d: any) => d[1])
        }]
      };
    });

    this.dashboardService.getRevenue().subscribe(data => {
      this.revenue = data;
    });
  }
}