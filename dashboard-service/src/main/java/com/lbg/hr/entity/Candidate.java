package com.lbg.hr.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "candidate")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "status")
    private String status;

    @Column(name = "interview_selection_date")
    private LocalDate dateOfSelection;

    @Column(name = "expected_joining_date")
    private LocalDate expectedJoiningDate;

    @Column(name = "joining_date")
    private LocalDate joiningDate;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String aadhaar;
    private String email;
    private String phone;
    private String address;

    private char grade;
    private String designation;
    private String hrCoordinator;
}
