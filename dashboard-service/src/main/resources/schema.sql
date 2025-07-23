--CREATE SCHEMA IF NOT EXISTS onboarding;

CREATE TABLE candidate (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    joining_date DATE,
    email VARCHAR(30) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(150) NOT NULL,
    interview_selection_date DATE NOT NULL,
    grade CHAR(1),
    designation VARCHAR(255),
    aadhaar VARCHAR(255),
    date_of_birth DATE NOT NULL,
    expected_joining_date DATE,
    hr_coordinator VARCHAR(255),
    CONSTRAINT unique_aadhaar_number UNIQUE (aadhaar),
    CONSTRAINT unique_personal_contact_number UNIQUE (phone),
    CONSTRAINT unique_personal_email UNIQUE (email)
);

CREATE TABLE notification (
    email VARCHAR(50) PRIMARY KEY,
    notification_message VARCHAR(5000)
);
