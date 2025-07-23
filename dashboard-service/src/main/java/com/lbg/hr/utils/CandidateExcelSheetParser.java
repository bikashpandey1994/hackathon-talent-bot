package com.lbg.hr.utils;

import com.lbg.hr.entity.Candidate;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.lbg.hr.enums.CandidateStatus;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


public class CandidateExcelSheetParser {

        public static List<Candidate> parseExcel(InputStream is) throws IOException {
            List<Candidate> candidates = new ArrayList<>();
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header
                Candidate candidate = new Candidate();
                candidate.setName(row.getCell(1).getStringCellValue());
                candidate.setGrade(row.getCell(2).getStringCellValue().charAt(0));
                candidate.setStatus(row.getCell(3).getStringCellValue());
                System.out.println("aadhaar going to do");
                candidate.setAadhaar(row.getCell(4).getStringCellValue());
                System.out.println("aadhaar done");
                candidate.setDateOfBirth(row.getCell(5).getLocalDateTimeCellValue().toLocalDate());;
                candidate.setEmail(row.getCell(6).getStringCellValue());
                System.out.println("Done till email");
                candidate.setPhone(String.valueOf(row.getCell(7).getStringCellValue()));
                System.out.println("phone done");
                candidate.setAddress(row.getCell(8).getStringCellValue());
                candidate.setDateOfSelection(row.getCell(9).getLocalDateTimeCellValue().toLocalDate());
                candidate.setExpectedJoiningDate(row.getCell(10).getLocalDateTimeCellValue().toLocalDate());
                if(row.getCell(11) != null) {
                    candidate.setJoiningDate(row.getCell(11).getLocalDateTimeCellValue().toLocalDate());
                }
                candidate.setDesignation(row.getCell(12).getStringCellValue());
                if(row.getCell(13) != null) {
                    candidate.setHrCoordinator(row.getCell(13).getStringCellValue());
                }
                candidates.add(candidate);
            }
            workbook.close();
            return candidates;
        }
    }

