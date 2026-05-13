import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterventionService } from '../../services/intervention';
import { AuthService } from '../../services/auth.service';
import { ReportService } from '../../services/report.service';
import { Intervention } from '../../models/intervention';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-interventions',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './interventions.html',
  styleUrl: './interventions.css',
})
export class Interventions implements OnInit {
  interventions: Intervention[] = [];
  selectedIntervention: Intervention | null = null;
  newIntervention: Intervention = {
    dateIntervention: '',
    typeIntervention: '',
    description: '',
    cout: 0,
    statut: 'En attente',
    vehiculeId: undefined
  };

  interventionTypes = [
    'Révision',
    'Remplacement de pièces',
    'Réparation moteur',
    'Entretien climatisation',
    'Révision freins',
    'Autre'
  ];

  statusOptions = ['En attente', 'En cours', 'Complétée'];

  constructor(
    private interventionService: InterventionService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadInterventions();
  }

  loadInterventions() {
    this.interventionService.getInterventions().subscribe({
      next: (data) => {
        this.interventions = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading interventions:', err);
      }
    });
  }

  addIntervention() {
    if (this.newIntervention.dateIntervention && 
        this.newIntervention.typeIntervention && 
        this.newIntervention.description &&
        this.newIntervention.vehiculeId) {
      this.interventionService.addIntervention(this.newIntervention).subscribe({
        next: () => {
          this.loadInterventions();
          this.newIntervention = {
            dateIntervention: '',
            typeIntervention: '',
            description: '',
            cout: 0,
            statut: 'En attente',
            vehiculeId: undefined
          };
        },
        error: (err) => {
          console.error('Error adding intervention:', err);
          alert('Erreur lors de l\'ajout de l\'intervention');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis');
    }
  }

  editIntervention(intervention: Intervention) {
    this.selectedIntervention = { ...intervention };
  }

  updateIntervention() {
    if (this.selectedIntervention && this.selectedIntervention.id) {
      this.interventionService.updateIntervention(this.selectedIntervention.id, this.selectedIntervention).subscribe({
        next: () => {
          this.loadInterventions();
          this.selectedIntervention = null;
        },
        error: (err) => {
          console.error('Error updating intervention:', err);
          alert('Erreur lors de la mise à jour de l\'intervention');
        }
      });
    }
  }

  deleteIntervention(id: number | undefined) {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      this.interventionService.deleteIntervention(id).subscribe({
        next: () => {
          this.loadInterventions();
        },
        error: (err) => {
          console.error('Error deleting intervention:', err);
          alert('Erreur lors de la suppression de l\'intervention');
        }
      });
    }
  }

  printIntervention(id: number | undefined) {
    if (id) {
      const intervention = this.interventions.find(i => i.id === id);
      if (intervention) {
        this.reportService.generateInterventionReport(intervention);
      }
    }
  }
}