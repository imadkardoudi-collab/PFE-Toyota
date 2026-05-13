export interface Vehicule {
  id?: number;
  marque: string;
  modele: string;
  immatriculation: string;
  annee: number;
  couleur: string;
  kilometrage: number;
  clientId?: number;
  client?: any;
}
