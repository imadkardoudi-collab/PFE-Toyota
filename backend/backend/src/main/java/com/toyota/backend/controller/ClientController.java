package com.toyota.backend.controller;

import com.toyota.backend.entity.Client;
import com.toyota.backend.repository.ClientRepository;
import com.toyota.backend.service.ClientService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientService clientService;
    private final ClientRepository clientRepository;

    public ClientController(ClientService clientService, ClientRepository clientRepository) {
        this.clientService = clientService;
        this.clientRepository = clientRepository;
    }

    // ✅ GET ALL
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Client getClient(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    // ✅ POST - Create new client with validation
    @PostMapping
    public Client createClient(@Valid @RequestBody Client client) {
        return clientService.saveClient(client);
    }

    // ✅ PUT - Update client
    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @Valid @RequestBody Client client) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        existingClient.setNom(client.getNom());
        existingClient.setPrenom(client.getPrenom());
        existingClient.setCin(client.getCin());
        existingClient.setEmail(client.getEmail());
        existingClient.setTelephone(client.getTelephone());
        existingClient.setAdresse(client.getAdresse());

        return clientRepository.save(existingClient);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientRepository.deleteById(id);
    }

    // 🔍 Search - General search by name, CIN, or phone
    @GetMapping("/search")
    public List<Client> searchClients(@RequestParam String q) {
        return clientService.searchClients(q);
    }

    // 🔍 Search by CIN
    @GetMapping("/cin/{cin}")
    public Optional<Client> searchByCin(@PathVariable String cin) {
        return clientService.findByCin(cin);
    }

    // 🔍 Search by phone
    @GetMapping("/phone/{phone}")
    public List<Client> searchByPhone(@PathVariable String phone) {
        return clientService.searchByPhone(phone);
    }
}