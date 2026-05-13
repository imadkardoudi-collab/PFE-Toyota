import { Vehicule } from './vehicule';

export interface Intervention {
  id?: number;

  dateIntervention: string;
  typeIntervention: string;
  description: string;
  cout: number;
  statut: string;
  vehiculeId?: number;
  vehicule?: Vehicule;
  technicienId?: number;
  technicien?: any;
}