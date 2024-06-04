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
    init_date DATE,
    due_date DATE/*,
    FOREIGN KEY(subjectID) REFERENCES Subject(subjectID)*/
);

CREATE TABLE First_Period (
    periodID INT,
    first_periodID INT PRIMARY KEY,
    bulletinID INT,
    observations VARCHAR(255),
    FOREIGN KEY(periodID) REFERENCES Period(periodID),
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

CREATE TABLE Second_Period (
    periodID INT,
    second_periodID INT PRIMARY KEY,
    bulletinID INT,
    observations VARCHAR(255),
    FOREIGN KEY(periodID) REFERENCES Period(periodID),
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

CREATE TABLE First_Advance (
    periodID INT,
    first_advanceID INT PRIMARY KEY,
    bulletinID INT,
    FOREIGN KEY(periodID) REFERENCES Period(periodID),
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
);

CREATE TABLE Second_Advance (
    periodID INT,
    second_advanceID INT PRIMARY KEY,
    bulletinID INT,
    FOREIGN KEY(periodID) REFERENCES Period(periodID),
    FOREIGN KEY(bulletinID) REFERENCES Bulletin(bulletinID)
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
VALUES (100, 856984218);
INSERT INTO Period (periodID, subjectID, init_date, due_date)
VALUES (001, 2, 01-01-2024, 31-03-2024);
INSERT INTO First_Period (periodID, first_periodID, bulletinID, observations)
VALUES (001, 011, 100, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (111, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (111, 001);
INSERT INTO Period (periodID, subjectID, init_date, due_date)
VALUES (002, 2, 01-04-2024, 31-06-2024);
INSERT INTO Second_Period (periodID, second_periodID, bulletinID, observations)
VALUES (002, 012, 100, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (112, 'TEP');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (112, 002);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (115, 'TEP');
INSERT INTO Pedagogical_Assessment_Intensification (assessmentID, second_periodID)
VALUES (115, 012);
INSERT INTO Period (periodID, subjectID, init_date, due_date)
VALUES (003, 2, 01-07-2024, 31-09-2024);
INSERT INTO First_Advance (periodID, first_advanceID, bulletinID)
VALUES (003, 013, 100);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (113, 'TED');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (113, 003);
INSERT INTO Period (periodID, subjectID, init_date, due_date)
VALUES (004, 2, 01-10-2024, 31-12-2024);
INSERT INTO Second_Advance (periodID, second_advanceID, bulletinID)
VALUES (004, 014, 100);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (114, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (114, 004);
INSERT INTO Annual_Closure (annual_closureID, bulletinID, init_date, due_date) 
VALUES (200, 100, 30-11-2023, 31-12-2024);
INSERT INTO December_Intensification (december_intensificationID, bulletinID, init_date, due_date) 
VALUES (300, 100, 01-12-2024, 15-12-2024);
INSERT INTO Fabruary_Intensification (fabruary_intensificationID, bulletinID, init_date, due_date) 
VALUES (400, 100, 01-02-2024, 15-02-2025);
INSERT INTO March_Intensification (march_intensificationID, bulletinID, init_date, due_date) 
VALUES (500, 100, 01-03-2024, 15-03-2024);
INSERT INTO Final_Report (final_reportID, bulletinID, init_date, due_date)
VALUES (600, 100, 01-06-2025, 30-06-2025);