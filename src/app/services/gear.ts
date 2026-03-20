import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Gear {
  _id?: string;
  name: string;
  model: string;
  serialNumber: string;
  ownerName: string;
  photoUrl?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class GearService {
  private apiUrl = 'http://localhost:3000/api/gear';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Gear[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<Gear>(`${this.apiUrl}/${id}`);
  }

  create(formData: FormData) {
    return this.http.post<Gear>(this.apiUrl, formData);
  }

  update(id: string, formData: FormData) {
    return this.http.put<Gear>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}