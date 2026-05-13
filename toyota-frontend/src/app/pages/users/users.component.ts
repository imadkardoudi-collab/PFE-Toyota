import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

interface User {
  id?: number;
  username: string;
  password?: string;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  newUser: User = {
    username: '',
    password: '',
    role: 'RECEPTIONNISTE'
  };

  roles = ['ADMIN', 'RECEPTIONNISTE'];
  displayedColumns: string[] = ['id', 'username', 'role', 'actions'];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  addUser(): void {
    if (!this.newUser.username || !this.newUser.password || !this.newUser.role) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.http.post<User>('/api/users', this.newUser).subscribe({
      next: (createdUser) => {
        this.users.push(createdUser);
        this.newUser = {
          username: '',
          password: '',
          role: 'RECEPTIONNISTE'
        };
        alert('Utilisateur créé avec succès');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating user:', err);
        alert('Erreur lors de la création de l\'utilisateur');
      }
    });
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
  }

  updateUser(): void {
    if (!this.selectedUser) return;

    if (!this.selectedUser.username || !this.selectedUser.role) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    this.http.put<User>(`/api/users/${this.selectedUser.id}`, this.selectedUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.selectedUser = null;
        alert('Utilisateur mis à jour avec succès');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Erreur lors de la mise à jour de l\'utilisateur');
      }
    });
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.http.delete(`/api/users/${id}`).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          alert('Utilisateur supprimé avec succès');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Erreur lors de la suppression de l\'utilisateur');
        }
      });
    }
  }

  filterByRole(role: string): User[] {
    if (!role) return this.users;
    return this.users.filter(u => u.role === role);
  }

  getTechnicianCount(): number {
    return this.users.filter(u => u.role === 'RECEPTIONNISTE').length;
  }

  getAdminCount(): number {
    return this.users.filter(u => u.role === 'ADMIN').length;
  }
}
