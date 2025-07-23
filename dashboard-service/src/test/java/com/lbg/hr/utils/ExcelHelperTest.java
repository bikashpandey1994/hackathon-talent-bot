package com.lbg.hr.utils;

import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

public class ExcelHelperTest {

   /* @Test
    public void testParseExcelWithFullFields() throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Candidates");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Name");
        header.createCell(1).setCellValue("Status");
        header.createCell(2).setCellValue("Grade");
        header.createCell(3).setCellValue("Designation");
        header.createCell(4).setCellValue("DateOfSelection");
        header.createCell(5).setCellValue("DateOfJoining");
        header.createCell(6).setCellValue("Phone");
        header.createCell(7).setCellValue("Email");
        header.createCell(8).setCellValue("Address");

        Row row = sheet.createRow(1);
        row.createCell(0).setCellValue("Tom");
        row.createCell(1).setCellValue("Selected");
        row.createCell(2).setCellValue("A1");
        row.createCell(3).setCellValue("Developer");
        row.createCell(4).setCellValue("2024-06-01");
        row.createCell(5).setCellValue("2024-07-01");
        row.createCell(6).setCellValue("9876543210");
        row.createCell(7).setCellValue("tom@example.com");
        row.createCell(8).setCellValue("Chennai");

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();

        InputStream is = new ByteArrayInputStream(bos.toByteArray());

        List<Candidate> candidates = ExcelHelper.parseExcel(is);

        assertEquals(1, candidates.size());
        assertEquals("Tom", candidates.get(0).getName());
        assertEquals("A1", candidates.get(0).getGrade());
    } */
}