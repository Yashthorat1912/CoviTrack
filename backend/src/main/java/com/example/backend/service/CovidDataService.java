package com.example.backend.service;

import com.example.backend.model.StateCovidData;
import com.example.backend.repository.StateCovidDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class CovidDataService {

  @Autowired
  private StateCovidDataRepository repository;

  private static final String API_URL = "https://api.rootnet.in/covid19-in/stats/latest";

  public void fetchAndStoreCovidData() {
    RestTemplate restTemplate = new RestTemplate();
    String response = restTemplate.getForObject(API_URL, String.class);

    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode root = objectMapper.readTree(response);
      JsonNode regionalData = root.path("data").path("regional");

      for (JsonNode state : regionalData) {
        String stateName = state.get("loc").asText();
        int confirmed = state.get("totalConfirmed").asInt();
        int recovered = state.get("discharged").asInt();
        int deaths = state.get("deaths").asInt();

        // Check if state already exists
        StateCovidData existingData = repository.findByStateName(stateName);

        if (existingData == null) {
          existingData = new StateCovidData();
          existingData.setStateName(stateName);
        }

        existingData.setConfirmedCases(confirmed);
        existingData.setRecovered(recovered);
        existingData.setDeaths(deaths);

        repository.save(existingData); // Save to database
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public List<StateCovidData> getAllStateCovidData() {
    return repository.findAll();
  }

  public void saveStateCovidData(StateCovidData stateCovidData) {
    repository.save(stateCovidData);
  }

  public void updateStateCovidData(Long id, StateCovidData stateCovidData) {
    StateCovidData existingData = repository.findById(id).orElseThrow(() -> new RuntimeException("State not found"));
    existingData.setConfirmedCases(stateCovidData.getConfirmedCases());
    existingData.setRecovered(stateCovidData.getRecovered());
    existingData.setDeaths(stateCovidData.getDeaths());
    repository.save(existingData);
  }

  public void deleteStateCovidData(Long id) {
    repository.deleteById(id);
  }
}
