package com.lbg.hr.dto;

import com.lbg.hr.enums.CandidateStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CandidateSummaryDTO {
    private Long id;
    private String name;
    private Character grade;
    private String designation;
    private String status;
    private LocalDate expectedJoiningDate;
}
