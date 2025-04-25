package com.example.backend.controller;

import com.example.backend.model.StateCovidData;
import com.example.backend.service.CovidDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/covid")
public class StateDataController {

  @Autowired
  private CovidDataService covidDataService;

  @GetMapping("/fetch-data")
  public String fetchCovidData() {
    covidDataService.fetchAndStoreCovidData();
    return "Data Fetched and Stored in Database!";
  }

  @GetMapping("/state-data")
  public List<StateCovidData> getStateData() {
    return covidDataService.getAllStateCovidData();
  }

  @PostMapping("/add-state")
  public ResponseEntity<String> addStateData(@RequestBody StateCovidData stateCovidData) {
    covidDataService.saveStateCovidData(stateCovidData);
    return ResponseEntity.ok("State data added successfully!");
  }

  @PutMapping("/update-state/{id}")
  public String updateStateData(@PathVariable Long id, @RequestBody StateCovidData stateCovidData) {
    covidDataService.updateStateCovidData(id, stateCovidData);
    return "State data updated successfully!";
  }

  @DeleteMapping("/delete-state/{id}")
  public String deleteStateData(@PathVariable Long id) {
    covidDataService.deleteStateCovidData(id);
    return "State data deleted successfully!";
  }

  @GetMapping("/states")
  public ResponseEntity<List<StateCovidData>> getAllStates() {
    List<StateCovidData> stateList = covidDataService.getAllStateCovidData();
    return ResponseEntity.ok(stateList);
  }
}
