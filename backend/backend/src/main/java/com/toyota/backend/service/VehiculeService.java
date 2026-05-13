package com.toyota.backend.service;

import com.toyota.backend.entity.Client;
import com.toyota.backend.entity.Vehicule;
import com.toyota.backend.repository.ClientRepository;
import com.toyota.backend.repository.VehiculeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculeService {

    private final VehiculeRepository vehiculeRepository;
    private final ClientRepository clientRepository;

    public VehiculeService(VehiculeRepository vehiculeRepository,
                           ClientRepository clientRepository) {
        this.vehiculeRepository = vehiculeRepository;
        this.clientRepository = clientRepository;
    }

    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    public Vehicule saveVehicule(Vehicule vehicule) {

        if (vehicule.getClient() == null || vehicule.getClient().getId() == null) {
            throw new RuntimeException("Client ID is required");
        }

        Long clientId = vehicule.getClient().getId();

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id = " + clientId));

        vehicule.setClient(client);

        return vehiculeRepository.save(vehicule);
    }

    public Vehicule updateVehicule(Long id, Vehicule vehicule) {
        Vehicule existingVehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule not found"));

        existingVehicule.setMarque(vehicule.getMarque());
        existingVehicule.setModele(vehicule.getModele());
        existingVehicule.setImmatriculation(vehicule.getImmatriculation());
        existingVehicule.setAnnee(vehicule.getAnnee());
        existingVehicule.setCouleur(vehicule.getCouleur());
        existingVehicule.setKilometrage(vehicule.getKilometrage());

        return vehiculeRepository.save(existingVehicule);
    }

    public Vehicule getVehiculeById(Long id) {
        return vehiculeRepository.findById(id).orElse(null);
    }

    public void deleteVehicule(Long id) {
        vehiculeRepository.deleteById(id);
    }

    public List<Vehicule> getVehiculesByClientId(Long clientId) {
        return vehiculeRepository.findVehiculesByClientId(clientId);
    }

    public Optional<Vehicule> findByImmatriculation(String immatriculation) {
        return vehiculeRepository.findByImmatriculation(immatriculation);
    }

    public List<Vehicule> searchByMarque(String marque) {
        return vehiculeRepository.findByMarqueContaining(marque);
    }

    public List<Vehicule> searchByModele(String modele) {
        return vehiculeRepository.findByModeleContaining(modele);
    }
}