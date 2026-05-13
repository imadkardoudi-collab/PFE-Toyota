package com.toyota.backend.service;

import com.toyota.backend.entity.Client;
import com.toyota.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    // Constructor Injection (bonne pratique)
    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // 🔹 GET ALL
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // 🔹 GET BY ID
    public Client getClientById(Long id) {
        return clientRepository.findById(id).orElse(null);
    }

    // 🔹 SAVE (CREATE)
    public Client saveClient(Client client) {
        if (client.getDateInscription() == null) {
            client.setDateInscription(LocalDate.now());
        }
        return clientRepository.save(client);
    }

    // 🔹 DELETE
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
    
    public Client updateClient(Long id, Client newClient) {
        Client client = clientRepository.findById(id).orElse(null);

        if (client != null) {
            client.setNom(newClient.getNom());
            client.setPrenom(newClient.getPrenom());
            client.setCin(newClient.getCin());
            client.setTelephone(newClient.getTelephone());
            client.setEmail(newClient.getEmail());
            client.setAdresse(newClient.getAdresse());

            return clientRepository.save(client);
        }

        return null;
    }
    
    // 🔍 Search by name, CIN, or phone
    public List<Client> searchClients(String searchTerm) {
        return clientRepository.searchClients(searchTerm);
    }
    
    public List<Client> searchByName(String nom) {
        return clientRepository.findByNomContaining(nom);
    }
    
    public Optional<Client> findByCin(String cin) {
        return clientRepository.findByCin(cin);
    }
    
    public List<Client> searchByPhone(String telephone) {
        return clientRepository.findByTelephoneContaining(telephone);
    }
}