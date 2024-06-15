CREATE DATABASE studentDB;

USE studentDB;

CREATE TABLE Student (
    CUIL VARCHAR(255) PRIMARY KEY NOT NULL
);

CREATE TABLE Account (
    CUIL VARCHAR(255) PRIMARY KEY NOT NULL,
    DNI VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)
);

CREATE TABLE Personal_Information (
    CUIL VARCHAR(255) PRIMARY KEY NOT NULL,
    DNI VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100),
    last_name1 VARCHAR(100) NOT NULL,
    last_name2 VARCHAR(100),
    phone_number TEXT NOT NULL,
    landline_phone_number TEXT,
    direction TEXT NOT NULL,
    FOREIGN KEY(CUIL) REFERENCES Student(CUIL)
);

CREATE TABLE Student_Information (
    CUIL VARCHAR(255) PRIMARY KEY NOT NULL,
    blood_type VARCHAR(10) NOT NULL,
    social_work VARCHAR(10)
);

INSERT INTO Student (CUIL)
VALUES ('20472561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20472561562', '47256156', 'juan.carlos123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, phone_number, direction)
VALUES ('20472561562', '47256156', 'juan', 'carlos', 'roldon', '223-345-3014', 'las manos');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20472561562', 'B', 'Galeno');

INSERT INTO Student (CUIL)
VALUES ('20482561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20482561562', '48256156', 'ian.avellaneda123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, last_name1, phone_number, direction)
VALUES ('20482561562', '48256156', 'ian', 'avellaneda', '223-345-3015', 'las orejas');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20482561562', 'A', 'SAMI');

INSERT INTO Student (CUIL)
VALUES ('20492561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20492561562', '49256156', 'maria.jose123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES ('20492561562', '49256156', 'maria', 'jose', 'acevedo', 'gonzales', '223-345-3016', 'las palmas');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20492561562', 'B', 'Osde');

INSERT INTO Student (CUIL)
VALUES ('20502561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20502561562', '50256156', 'branco.samien123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, phone_number, direction)
VALUES ('20502561562', '50256156', 'branco', 'samien', 'aguirre', '223-345-3017', 'los dedos');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20502561562', 'AB', 'Osde');

INSERT INTO Student (CUIL)
VALUES ('20512561562');
INSERT INTO Account (CUIL, DNI, password)
VALUES ('20512561562', '50256156', 'nahuel.cludio123');
INSERT INTO Personal_Information (CUIL, DNI, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES ('20512561562', '50256156', 'nahuel', 'cludio', 'palacios', 'navarro', '223-345-3018', 'las piernas');
INSERT INTO Student_Information (CUIL, blood_type, social_work)
VALUES ('20512561562', 'O', 'Medicum');