CREATE DATABASE courseDB;

USE courseDB;

CREATE TABLE Course (
    courseID INT PRIMARY KEY NOT NULL,
    year INT NOT NULL,
    division INT NOT NULL
);

-- CREATE TABLE Course_Group (
--     courseID INT PRIMARY KEY NOT NULL,
--     group VARCHAR(1) PRIMARY KEY NOT NULL,
--     FOREIGN KEY(courseID) REFERENCES Course(courseID)
-- );

CREATE TABLE Inscription (
    inscriptionID INT PRIMARY KEY NOT NULL,
    courseID INT NOT NULL,
    groupCourse VARCHAR(1) NOT NULL,
    CUIL INT NOT NULL,
    FOREIGN KEY(courseID) REFERENCES Course(courseID)/*,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)*/
);

INSERT INTO Course (courseID, year, division)
VALUES (1, 7, 2);
-- INSERT INTO Course_Group (courseID, group)
-- VALUES (1, 'a');
INSERT INTO Inscription (inscriptionID, courseID, groupCourse, CUIL)
VALUES (11, 1, 'a', 123456789);

INSERT INTO Course (courseID, year, division)
VALUES (2, 7, 1);
-- INSERT INTO Course_Group (courseID, group)
-- VALUES (1, 'b');
INSERT INTO Inscription (inscriptionID, courseID, groupCourse, CUIL)
VALUES (12, 1, 'b', 987654321);