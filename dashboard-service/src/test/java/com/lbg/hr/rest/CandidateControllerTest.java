package com.lbg.hr.rest;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.List;

import com.lbg.hr.entity.Candidate;
import com.lbg.hr.enums.CandidateStatus;
import com.lbg.hr.service.CandidateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(SpringExtension.class)
@WebMvcTest(CandidateController.class)
public class CandidateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CandidateService candidateService;

   /* @Test
    public void testGetAllCandidates() throws Exception {
        Candidate candidate = new Candidate();
        candidate.setName("John");
        candidate.setEmail("john@gmail.com");
        candidate.setStatus(CandidateStatus.SELECTED);
        candidate.setGrade("B");
        candidate.setDesignation("Analyst");
        candidate.setDateOfSelection(LocalDate.of(2025, 6, 5));
        candidate.setJoiningDate(LocalDate.of(2025, 8, 1));
        candidate.setPhone("1234567890");
        candidate.setAddress("Bangalore");

        when(candidateService.getAllCandidates()).thenReturn(List.of(candidate));

        mockMvc.perform(get("/candidates"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size()").value(1))
            .andExpect(jsonPath("$[0].name").value("John"))
            .andExpect(jsonPath("$[0].designation").value("Analyst"))
            .andExpect(jsonPath("$[0].status").value("Selected"))
            .andExpect(jsonPath("$[0].phone").value("1234567890"));
    }*/
}