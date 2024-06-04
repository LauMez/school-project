CREATE DATABASE studentDB;

USE studentDB;

CREATE TABLE Student (
    CUIL INT PRIMARY KEY NOT NULL
);

CREATE TABLE Account (
    CUIL INT PRIMARY KEY NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)
);

CREATE TABLE Personal_Information (
    CUIL INT PRIMARY KEY NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100),
    last_name1 VARCHAR(100) NOT NULL,
    last_name2 VARCHAR(100),
    phone_number TEXT NOT NULL,
    direction TEXT NOT NULL,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)
);

INSERT INTO Student (CUIL)
VALUES (123456789);
INSERT INTO Account (CUIL, password)
VALUES (123456789, 'juan.carlos123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, phone_number, direction)
VALUES (123456789, 'juan', 'carlos', 'roldon', '223-345-3014', 'las manos');

INSERT INTO Student (CUIL)
VALUES (987654321);
INSERT INTO Account (CUIL, password)
VALUES (987654321, 'ian.avellaneda123');
INSERT INTO Personal_Information (CUIL, first_name, last_name1, phone_number, direction)
VALUES (987654321, 'ian', 'avellaneda', '223-345-3015', 'las orejas');

INSERT INTO Student (CUIL)
VALUES (123654789);
INSERT INTO Account (CUIL, password)
VALUES (123654789, 'maria.jose123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES (123654789, 'maria', 'jose', 'acevedo', 'gonzales', '223-345-3016', 'las palmas');

INSERT INTO Student (CUIL)
VALUES (987456321);
INSERT INTO Account (CUIL, password)
VALUES (987456321, 'branco.samien123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, phone_number, direction)
VALUES (987456321, 'branco', 'samien', 'aguirre', '223-345-3017', 'los dedos');

INSERT INTO Student (CUIL)
VALUES (147852369);
INSERT INTO Account (CUIL, password)
VALUES (147852369, 'nahuel.cludio123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES (147852369, 'nahuel', 'cludio', 'palacios', 'navarro', '223-345-3018', 'las piernas');