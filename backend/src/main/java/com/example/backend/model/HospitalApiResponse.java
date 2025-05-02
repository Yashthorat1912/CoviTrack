package com.example.backend.model;

import lombok.Data;
import java.util.List;

@Data
public class HospitalApiResponse {
  private DataWrapper data;

  @Data
  public static class DataWrapper {
    private List<RegionalData> regional;
  }

  @Data
  public static class RegionalData {
    private String state;
    private int totalHospitals;
    private int totalBeds;
    private int ruralHospitals;
    private int ruralBeds;
    private int urbanHospitals;
    private int urbanBeds;
  }
}
