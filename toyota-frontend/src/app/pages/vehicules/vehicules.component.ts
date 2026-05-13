import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculeService } from '../../services/vehicule';
import { AuthService } from '../../services/auth.service';
import { Vehicule } from '../../models/vehicule';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-vehicules',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './vehicules.html',
  styleUrl: './vehicules.css',
})
export class Vehicules implements OnInit {
  vehicules: Vehicule[] = [];
  selectedVehicule: Vehicule | null = null;
  newVehicule: Vehicule = {
    marque: '',
    modele: '',
    immatriculation: '',
    annee: new Date().getFullYear(),
    couleur: '',
    kilometrage: 0
  };

  constructor(
    private vehiculeService: VehiculeService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadVehicules();
  }

  loadVehicules() {
    this.vehiculeService.getVehicules().subscribe({
      next: (data) => {
        this.vehicules = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
      }
    });
  }

  addVehicule() {
    if (this.newVehicule.marque && this.newVehicule.modele && this.newVehicule.immatriculation) {
      this.vehiculeService.addVehicule(this.newVehicule).subscribe({
        next: () => {
          this.loadVehicules();
          this.newVehicule = {
            marque: '',
            modele: '',
            immatriculation: '',
            annee: new Date().getFullYear(),
            couleur: '',
            kilometrage: 0
          };
        },
        error: (err) => {
          console.error('Error adding vehicle:', err);
          alert('Erreur lors de l\'ajout du véhicule');
        }
      });
    } else {
      alert('Veuillez remplir les champs requis: Marque, Modèle, Immatriculation');
    }
  }

  editVehicule(vehicule: Vehicule) {
    this.selectedVehicule = { ...vehicule };
  }

  updateVehicule() {
    if (this.selectedVehicule && this.selectedVehicule.id) {
      this.vehiculeService.updateVehicule(this.selectedVehicule.id, this.selectedVehicule).subscribe({
        next: () => {
          this.loadVehicules();
          this.selectedVehicule = null;
        },
        error: (err) => {
          console.error('Error updating vehicle:', err);
          alert('Erreur lors de la mise à jour du véhicule');
        }
      });
    }
  }

  deleteVehicule(id: number | undefined) {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.vehiculeService.deleteVehicule(id).subscribe({
        next: () => {
          this.loadVehicules();
        },
        error: (err) => {
          console.error('Error deleting vehicle:', err);
          alert('Erreur lors de la suppression du véhicule');
        }
      });
    }
  }
}