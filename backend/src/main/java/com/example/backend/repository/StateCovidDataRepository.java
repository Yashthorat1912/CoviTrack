package com.example.backend.repository;

import com.example.backend.model.StateCovidData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateCovidDataRepository extends JpaRepository<StateCovidData, Long> {
  StateCovidData findByStateName(String state_name);
}
