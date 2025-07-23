package com.lbg.hr.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;

import com.lbg.hr.entity.Candidate;
import com.lbg.hr.repository.CandidateRepository;
import com.lbg.hr.service.CandidateService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CandidateServiceImplTest {

    @Mock
    private CandidateRepository candidateRepository;

    @InjectMocks
    private CandidateService candidateService;

   /* @Test
    public void testSaveAllCandidates() {
        Candidate c = new Candidate();
        c.setName("John");
        c.setEmail("john@example.com");
        c.setStatus("Selected");
        c.setGrade("A1");
        c.setDesignation("Engineer");
        c.setDateOfSelection(LocalDate.of(2024, 6, 1));
        c.setDateOfJoining(LocalDate.of(2024, 7, 1));
        c.setPhone("9876543210");
        c.setAddress("Hyderabad");

        List<Candidate> candidateList = List.of(c);

        when(candidateRepository.saveAll(candidateList)).thenReturn(candidateList);

        List<Candidate> saved = candidateService.saveAllCandidates(candidateList);

        assertEquals(1, saved.size());
        assertEquals("John", saved.get(0).getName());
        verify(candidateRepository, times(1)).saveAll(candidateList);
    }

    @Test
    public void testGetAllCandidates() {
        Candidate c = new Candidate();
        c.setName("Alice");
        c.setStatus("Onboarded");

        when(candidateRepository.findAll()).thenReturn(List.of(c));

        List<Candidate> result = candidateService.getAllCandidates();

        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).getName());
        assertEquals("Onboarded", result.get(0).getStatus());
    } */
}