CREATE DATABASE subjectDB;

USE subjectDB;

CREATE TABLE Subject (
    subjectID INT PRIMARY KEY NOT NULL,
    courseID INT NOT NULL,
    name VARCHAR(100) NOT NULL/*,
    FOREIGN KEY(courseID) REFERENCES Course(courseID)*/
);

CREATE TABLE Impartition (
    subjectID INT PRIMARY KEY NOT NULL,
    CUIL INT NOT NULL/*,
    FOREIGN KEY(CUIL) REFERENCES Professor(CUIL)*/
);

CREATE TABLE Subject_Schedule (
    scheduleID INT PRIMARY KEY NOT NULL,
    subjectID INT NOT NULL,
    day VARCHAR(20) NOT NULL,
    schedule VARCHAR(20) NOT NULL
);

INSERT INTO Subject (subjectID, courseID, name)
VALUES (1, 1, 'matematica');
INSERT INTO Impartition (subjectID, CUIL)
VALUES (1, 851498326);
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule)
VALUES (21, 1, 'martes', '13:10');
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule)
VALUES (22, 1, 'juves', '15:30');

INSERT INTO Subject (subjectID, courseID, name)
VALUES (2, 1, 'Ingles');
INSERT INTO Impartition (subjectID, CUIL)
VALUES (2, 968526958);
INSERT INTO Subject_Schedule (scheduleID, subjectID, day, schedule)
VALUES (23, 2, 'lunes', '13:10');
