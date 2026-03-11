package com.artcomm.api.domain.commission.repository;

import com.artcomm.api.domain.commission.entity.CommissionOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommissionOptionRepository extends JpaRepository<CommissionOption, Long> {
}
