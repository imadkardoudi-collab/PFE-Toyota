import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client';
import { AuthService } from '../../services/auth.service';
import { Client } from '../../models/client';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-clients',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  dataSource = new MatTableDataSource<any>();
  selectedClient: Client | null = null;
  newClient: Client = { nom: '', prenom: '', cin: '', email: '', telephone: '', adresse: '' };
  searchText: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientService: ClientService,
    private cd: ChangeDetectorRef,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.nom.toLowerCase().includes(filter) ||
        data.prenom.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter) ||
        data.cin.includes(filter) ||
        data.telephone.includes(filter);
    };
  }

  loadClients() {
    this.clientService.getClients().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.cd.detectChanges();
    });
  }

  addClient() {
    if (this.newClient.nom && this.newClient.prenom && this.newClient.cin) {
      this.clientService.addClient(this.newClient).subscribe({
        next: () => {
          this.loadClients();
          this.newClient = { nom: '', prenom: '', cin: '', email: '', telephone: '', adresse: '' };
        },
        error: (err) => {
          console.error('Error adding client:', err);
          alert('Erreur lors de l\'ajout du client');
        }
      });
    } else {
      alert('Veuillez remplir les champs requis: Nom, Prénom, CIN');
    }
  }

  editClient(client: Client) {
    this.selectedClient = { ...client };
  }

  updateClient() {
    if (this.selectedClient && this.selectedClient.id) {
      this.clientService.updateClient(this.selectedClient.id, this.selectedClient).subscribe({
        next: () => {
          this.loadClients();
          this.selectedClient = null;
        },
        error: (err) => {
          console.error('Error updating client:', err);
          alert('Erreur lors de la mise à jour du client');
        }
      });
    }
  }

  deleteClient(id: number | undefined) {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          console.error('Error deleting client:', err);
          alert('Erreur lors de la suppression du client');
        }
      });
    }
  }

  searchClients() {
    if (this.searchText.trim()) {
      this.clientService.searchClients(this.searchText).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.error('Error searching clients:', err);
        }
      });
    } else {
      this.loadClients();
    }
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  applyFilter(event: any) {
    const value = event.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}