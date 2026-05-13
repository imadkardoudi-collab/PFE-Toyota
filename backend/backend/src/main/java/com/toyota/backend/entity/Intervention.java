package com.toyota.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "interventions")
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date d'intervention est requise")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date_intervention")
    private LocalDate dateIntervention;

    @NotBlank(message = "Le type d'intervention est requis")
    @Column(name = "type_intervention")
    private String typeIntervention;

    @NotBlank(message = "La description est requise")
    private String description;

    @Min(value = 0, message = "Le coût ne peut pas être négatif")
    @NotNull(message = "Le coût est requis")
    private Double cout = 0.0;

    private String statut = "En attente";

    // 🔥 relation avec Vehicule
    @ManyToOne
    @JoinColumn(name = "vehicule_id", nullable = false)
    private Vehicule vehicule;

    // 🔥 relation avec Technicien (User)
    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private User technicien;

    public Intervention() {}

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public LocalDate getDateIntervention() {
        return dateIntervention;
    }

    public void setDateIntervention(LocalDate dateIntervention) {
        this.dateIntervention = dateIntervention;
    }

    public String getTypeIntervention() {
        return typeIntervention;
    }

    public void setTypeIntervention(String typeIntervention) {
        this.typeIntervention = typeIntervention;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCout() {
        return cout;
    }

    public void setCout(Double cout) {
        this.cout = cout;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Vehicule getVehicule() {
        return vehicule;
    }

    public void setVehicule(Vehicule vehicule) {
        this.vehicule = vehicule;
    }

    public User getTechnicien() {
        return technicien;
    }

    public void setTechnicien(User technicien) {
        this.technicien = technicien;
    }
}