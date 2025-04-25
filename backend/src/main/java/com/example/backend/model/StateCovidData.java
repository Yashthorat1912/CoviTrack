package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "state_covid_data")
public class StateCovidData {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "state_name", nullable = false) // Ensure this maps correctly
  private String stateName;

  @Column(name = "confirmed_cases")
  private int confirmedCases;

  @Column(name = "recovered")
  private int recovered;

  @Column(name = "deaths")
  private int deaths;
}
