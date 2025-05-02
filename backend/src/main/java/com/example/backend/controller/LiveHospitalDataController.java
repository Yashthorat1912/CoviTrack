package com.example.backend.controller;

import com.example.backend.model.HospitalApiResponse;
import com.example.backend.service.HospitalApiService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/live-hospitals")
@CrossOrigin
public class LiveHospitalDataController {

  private final HospitalApiService hospitalApiService;

  public LiveHospitalDataController(HospitalApiService hospitalApiService) {
    this.hospitalApiService = hospitalApiService;
  }

  @GetMapping
  public List<HospitalApiResponse.RegionalData> getLiveHospitalData() {
    return hospitalApiService.fetchHospitalData();
  }
}
