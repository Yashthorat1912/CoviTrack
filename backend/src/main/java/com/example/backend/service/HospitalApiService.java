package com.example.backend.service;

import com.example.backend.model.HospitalApiResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class HospitalApiService {

  private final RestTemplate restTemplate = new RestTemplate();

  public List<HospitalApiResponse.RegionalData> fetchHospitalData() {
    String apiUrl = "https://api.rootnet.in/covid19-in/hospitals/beds";
    HospitalApiResponse response = restTemplate.getForObject(apiUrl, HospitalApiResponse.class);
    return response.getData().getRegional();
  }
}
