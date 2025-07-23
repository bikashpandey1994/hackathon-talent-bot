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
public class CandidateDetailsDTO {
    private Long id;
    private String name;
    private Character grade;
    private String designation;
    private String status;
    private LocalDate dateOfSelection;
    private LocalDate expectedJoiningDate;
    private LocalDate actualJoiningDate;
    private LocalDate dateOfBirth;
    private String email;
    private String phone;
    private String address;
    private String aadhaar;
    private String hrCoordinator;
}
