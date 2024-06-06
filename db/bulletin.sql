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
VALUES (1001, 2, 100, 2024-07-01, 2024-09-31);
INSERT INTO First_Advance (periodID, first_advanceID)
VALUES (1001, 1101);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1111, 'TED');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1111, 1001);

INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (1002, 2, 100, 2024-01-01, 2024-03-31);
INSERT INTO First_Period (periodID, first_periodID, observations)
VALUES (1002, 1201, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1121, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1121, 1002);

INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (1003, 2, 100, 2024-10-01, 2024-12-31);
INSERT INTO Second_Advance (periodID, second_advanceID)
VALUES (1003, 1301);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1131, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1131, 1003);

INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (1004, 2, 100, 2024-04-01, 2024-06-31);
INSERT INTO Second_Period (periodID, second_periodID, observations)
VALUES (1004, 1401, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1141, 'TEP');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1141, 1004);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1151, 'TEP');
INSERT INTO Pedagogical_Assessment_Intensification (assessmentID, second_periodID)
VALUES (1151, 1401);

INSERT INTO Annual_Closure (annual_closureID, bulletinID, init_date, due_date) 
VALUES (2001, 100, 2024-11-01, 2024-12-31);

INSERT INTO December_Intensification (december_intensificationID, bulletinID, init_date, due_date) 
VALUES (3001, 100, 2024-11-01, 2024-12-31);

INSERT INTO Fabruary_Intensification (fabruary_intensificationID, bulletinID, init_date, due_date) 
VALUES (4001, 100, 2025-02-01, 2025-02-15);

INSERT INTO March_Intensification (march_intensificationID, bulletinID, init_date, due_date) 
VALUES (5001, 100, 2025-02-01, 2025-02-15);

INSERT INTO Final_Report (final_reportID, bulletinID, init_date, due_date)
VALUES (6001, 100, 2025-03-01, 2025-03-15);

-- -----------------------------------------------------------

INSERT INTO Bulletin (bulletinID, CUIL)
VALUES (101, 987654321);

INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (1005, 2, 101, 2024-07-01, 2024-09-31);
INSERT INTO First_Advance (periodID, first_advanceID)
VALUES (1005, 1102);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1161, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1161, 1005);

INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (1006, 2, 101, 2024-01-01, 2024-03-31);
INSERT INTO First_Period (periodID, first_periodID, observations)
VALUES (1006, 1202, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1171, 'TEP');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1171, 1006);

INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (1007, 2, 101, 2024-10-01, 2024-12-31);
INSERT INTO Second_Advance (periodID, second_advanceID)
VALUES (1007, 1302);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1181, 'TEP');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1181, 1007);

INSERT INTO Period (periodID, subjectID, bulletinID, init_date, due_date)
VALUES (1008, 2, 101, 2024-04-01, 2024-06-31);
INSERT INTO Second_Period (periodID, second_periodID, observations)
VALUES (1008, 1402, '');
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1191, 'TEA');
INSERT INTO Pedagogical_Assessment (assessmentID, periodID)
VALUES (1191, 1008);
INSERT INTO Assessment (assessmentID, qualification)
VALUES (1201, 'TEA');
INSERT INTO Pedagogical_Assessment_Intensification (assessmentID, second_periodID)
VALUES (1201, 1402);

INSERT INTO Annual_Closure (annual_closureID, bulletinID, init_date, due_date) 
VALUES (2002, 101, 2024-11-01, 2024-12-31);

INSERT INTO December_Intensification (december_intensificationID, bulletinID, init_date, due_date) 
VALUES (3002, 101, 2024-11-01, 2024-12-31);

INSERT INTO Fabruary_Intensification (fabruary_intensificationID, bulletinID, init_date, due_date) 
VALUES (4002, 101, 2025-02-01, 2025-02-15);

INSERT INTO March_Intensification (march_intensificationID, bulletinID, init_date, due_date) 
VALUES (5002, 101, 2025-02-01, 2025-02-15);

INSERT INTO Final_Report (final_reportID, bulletinID, init_date, due_date)
VALUES (6002, 101, 2025-03-01, 2025-03-15);

-- -----------------------------------------------------------