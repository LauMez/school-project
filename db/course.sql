CREATE DATABASE courseDB;

USE courseDB;

CREATE TABLE Course (
    courseID INT PRIMARY KEY NOT NULL,
    year INT NOT NULL,
    division INT NOT NULL
);

CREATE TABLE Course_Group (
    courseGroupID INT PRIMARY KEY NOT NULL,
    courseID INT NOT NULL,
    courseGroup VARCHAR(1) NOT NULL,
    FOREIGN KEY(courseID) REFERENCES Course(courseID)
);

CREATE TABLE Inscription (
    inscriptionID INT PRIMARY KEY NOT NULL,
    courseID INT NOT NULL,
    CUIL INT NOT NULL,
    FOREIGN KEY(courseID) REFERENCES Course(courseID)/*,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)*/
);

INSERT INTO Course (courseID, year, division)
VALUES (1, 7, 2);
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (1, 1, 'a');
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (2, 1, 'b');
INSERT INTO Inscription (inscriptionID, courseID, CUIL)
VALUES (11, 1, 123456789);

INSERT INTO Course (courseID, year, division)
VALUES (2, 7, 1);
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (3, 2, 'a');
INSERT INTO Course_Group (courseGroupID, courseID, courseGroup)
VALUES (4, 2, 'b');
INSERT INTO Inscription (inscriptionID, courseID, CUIL)
VALUES (12, 2, 987654321);