import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search clients by name, CIN, or phone
  searchClients(searchTerm: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/search?q=${searchTerm}`);
  }

  // Search by CIN specifically
  searchByCin(cin: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/cin/${cin}`);
  }

  // Search by phone
  searchByPhone(phone: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/phone/${phone}`);
  }
}