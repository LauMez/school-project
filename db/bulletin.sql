CREATE DATABASE bulletinDB;

USE bulletinDB;

CREATE TABLE Bulletin (
    bulletinID INT PRIMARY KEY,
    CUIL INT/*,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)*/
);

CREATE TABLE Period (
    periodID INT PRIMARY KEY,
    subjectID INT,
    bulletinID INT,
    init_date DATE,
    due_date DATE,
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
    /*,
    FOREIGN KEY(subjectID) REFERENCES Subject(subjectID)*/
);

CREATE TABLE First_Period (
    periodID INT,
    first_periodID INT PRIMARY KEY,
    observations VARCHAR(255),
    FOREIGN KEY(periodID) REFERENCES Period(periodID)
);

CREATE TABLE Second_Period (
    periodID INT,
    second_periodID INT PRIMARY KEY,
    observations VARCHAR(255),
    FOREIGN KEY(periodID) REFERENCES Period(periodID)
);

CREATE TABLE First_Advance (
    periodID INT,
    first_advanceID INT PRIMARY KEY,
    FOREIGN KEY(periodID) REFERENCES Period(periodID)
);

CREATE TABLE Second_Advance (
    periodID INT,
    second_advanceID INT PRIMARY KEY,
    FOREIGN KEY(periodID) REFERENCES Period(periodID)
);

CREATE TABLE Assessment (
    assessmentID INT PRIMARY KEY,
    qualification VARCHAR(3)
);

CREATE TABLE Pedagogical_Assessment (
    assessmentID INT PRIMARY KEY,
    periodID INT,
    FOREIGN KEY(periodID) REFERENCES Period(periodID)
);

CREATE TABLE Pedagogical_Assessment_Intensification (
    assessmentID INT PRIMARY KEY,
    second_periodID INT,
    FOREIGN KEY(second_periodID) REFERENCES Second_Period(second_periodID)
);

CREATE TABLE Annual_Closure (
    annual_closureID INT PRIMARY KEY,
    bulletinID INT,
    init_date DATE,
    due_date DATE,
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

CREATE TABLE December_Intensification (
    december_intensificationID INT PRIMARY KEY,
    bulletinID INT,
    init_date DATE,
    due_date DATE,
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

CREATE TABLE Fabruary_Intensification (
    fabruary_intensificationID INT PRIMARY KEY,
    bulletinID INT,
    init_date DATE,
    due_date DATE,
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

CREATE TABLE March_Intensification (
    march_intensificationID INT PRIMARY KEY,
    bulletinID INT,
    init_date DATE,
    due_date DATE,
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

CREATE TABLE Final_Report (
    final_reportID INT PRIMARY KEY,
    bulletinID INT,
    init_date DATE,
    due_date DATE,
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

INSERT INTO Bulletin (bulletinID, CUIL)
VALUES (100, 123456789);
INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (001, 2, 100, 2024-01-01, 2024-03-31);
INSERT INTO First_Period (periodID, first_periodID, observations)
VALUES (001, 011, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (111, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (111, 001);
INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (002, 2, 100, 2024-04-01, 2024-06-31);
INSERT INTO Second_Period (periodID, second_periodID, observations)
VALUES (002, 012, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (112, 'TEP');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (112, 002);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (115, 'TEP');
INSERT INTO Pedagogical_Assessment_Intensification (assessmentID, second_periodID)
VALUES (115, 012);
INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (003, 2, 100, 2024-07-01, 2024-09-31);
INSERT INTO First_Advance (periodID, first_advanceID)
VALUES (003, 013);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (113, 'TED');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (113, 003);
INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (004, 2, 100, 2024-10-01, 2024-12-31);
INSERT INTO Second_Advance (periodID, second_advanceID)
VALUES (004, 014);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (114, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (114, 004);
INSERT INTO Annual_Closure (annual_closureID, bulletinID, init_date, due_date) 
VALUES (200, 100, 2024-11-01, 2024-12-31);
INSERT INTO December_Intensification (december_intensificationID, bulletinID, init_date, due_date) 
VALUES (300, 100, 2024-11-01, 2024-12-31);
INSERT INTO Fabruary_Intensification (fabruary_intensificationID, bulletinID, init_date, due_date) 
VALUES (400, 100, 2025-02-01, 2025-02-15);
INSERT INTO March_Intensification (march_intensificationID, bulletinID, init_date, due_date) 
VALUES (500, 100, 2025-02-01, 2025-02-15);
INSERT INTO Final_Report (final_reportID, bulletinID, init_date, due_date)
VALUES (600, 100, 2025-03-01, 2025-03-15);