package com.toyota.backend.controller;

import com.toyota.backend.entity.Vehicule;
import com.toyota.backend.repository.VehiculeRepository;
import com.toyota.backend.service.VehiculeService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicules")
@CrossOrigin(origins = "http://localhost:4200")
public class VehiculeController {

    private final VehiculeService vehiculeService;
    private final VehiculeRepository vehiculeRepository;

    public VehiculeController(VehiculeService vehiculeService, VehiculeRepository vehiculeRepository) {
        this.vehiculeService = vehiculeService;
        this.vehiculeRepository = vehiculeRepository;
    }

    // GET ALL
    @GetMapping
    public List<Vehicule> getAllVehicules() {
        return vehiculeService.getAllVehicules();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Vehicule getVehicule(@PathVariable Long id) {
        return vehiculeService.getVehiculeById(id);
    }

    // POST - Create with validation
    @PostMapping
    public Vehicule createVehicule(@Valid @RequestBody Vehicule vehicule) {
        return vehiculeService.saveVehicule(vehicule);
    }

    // PUT - Update vehicule
    @PutMapping("/{id}")
    public Vehicule updateVehicule(@PathVariable Long id, @Valid @RequestBody Vehicule vehicule) {
        return vehiculeService.updateVehicule(id, vehicule);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteVehicule(@PathVariable Long id) {
        vehiculeService.deleteVehicule(id);
    }

    // Get vehicles by client
    @GetMapping("/client/{clientId}")
    public List<Vehicule> getVehiculesByClient(@PathVariable Long clientId) {
        return vehiculeService.getVehiculesByClientId(clientId);
    }

    // Search by immatriculation
    @GetMapping("/immatriculation/{immatriculation}")
    public Optional<Vehicule> getByImmatriculation(@PathVariable String immatriculation) {
        return vehiculeService.findByImmatriculation(immatriculation);
    }

    // Search by marque
    @GetMapping("/search/marque")
    public List<Vehicule> searchByMarque(@RequestParam String marque) {
        return vehiculeService.searchByMarque(marque);
    }

    // Search by modele
    @GetMapping("/search/modele")
    public List<Vehicule> searchByModele(@RequestParam String modele) {
        return vehiculeService.searchByModele(modele);
    }
}