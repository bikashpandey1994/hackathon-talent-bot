package com.lbg.hr.entity;

import java.time.LocalDate;
import java.util.Date;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.lbg.hr.enums.CandidateStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "candidate", schema = "onboarding")
@Getter
@Setter
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", columnDefinition = "candidate_status")
    private CandidateStatus status;

    @Column(name = "interview_selection_date")
    private Date dateOfSelection;

    @Column(name = "expected_joining_date")
    private Date expectedJoiningDate;

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
    private String hrcoordinator;
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public CandidateStatus getStatus() {
		return status;
	}
	public void setStatus(CandidateStatus status) {
		this.status = status;
	}
	public Date getDateOfSelection() {
		return dateOfSelection;
	}
	public void setDateOfSelection(Date dateOfSelection) {
		this.dateOfSelection = dateOfSelection;
	}
	public Date getExpectedJoiningDate() {
		return expectedJoiningDate;
	}
	public void setExpectedJoiningDate(Date expectedJoiningDate) {
		this.expectedJoiningDate = expectedJoiningDate;
	}
	public LocalDate getJoiningDate() {
		return joiningDate;
	}
	public void setJoiningDate(LocalDate joiningDate) {
		this.joiningDate = joiningDate;
	}
	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public String getAadhaar() {
		return aadhaar;
	}
	public void setAadhaar(String aadhaar) {
		this.aadhaar = aadhaar;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public char getGrade() {
		return grade;
	}
	public void setGrade(char grade) {
		this.grade = grade;
	}
	public String getDesignation() {
		return designation;
	}
	public void setDesignation(String designation) {
		this.designation = designation;
	}
	public String getHrcoordinator() {
		return hrcoordinator;
	}
	public void setHrcoordinator(String hrcoordinator) {
		this.hrcoordinator = hrcoordinator;
	}
}

