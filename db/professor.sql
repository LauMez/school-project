CREATE DATABASE professorDB;

USE professorDB;

CREATE TABLE Professor (
    CUIL INT PRIMARY KEY NOT NULL
);
    
CREATE TABLE Account (
    CUIL INT PRIMARY KEY NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY(CUIL) REFERENCES Professor(CUIL)
);

CREATE TABLE Personal_Information (
    CUIL INT PRIMARY KEY NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100),
    last_name1 VARCHAR(100) NOT NULL,
    last_name2 VARCHAR(100),
    phone_number TEXT NOT NULL,
    direction TEXT NOT NULL,
    FOREIGN KEY(CUIL) REFERENCES Professor(CUIL)
);

INSERT INTO Professor (CUIL)
VALUES (851498326);
INSERT INTO Account (CUIL, password)
VALUES (851498326, 'pedro.juan123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, phone_number, direction)
VALUES (851498326, 'pedro', 'juan', 'sevilla', '223-345-4701', 'las manos');

INSERT INTO Professor (CUIL)
VALUES (843974126);
INSERT INTO Account (CUIL, password)
VALUES (843974126, 'santiago.moneda123');
INSERT INTO Personal_Information (CUIL, first_name, last_name1, phone_number, direction)
VALUES (843974126, 'santiago', 'moneda', '223-345-4702', 'las orejas');

INSERT INTO Professor (CUIL)
VALUES (968526958);
INSERT INTO Account (CUIL, password)
VALUES (968526958, 'maria.laura123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES (968526958, 'maria', 'laura', 'gimenez', 'gonzales', '223-345-4703', 'las palmas');

INSERT INTO Professor (CUIL)
VALUES (136849572);
INSERT INTO Account (CUIL, password)
VALUES (136849572, 'franco.lucas123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, phone_number, direction)
VALUES (136849572, 'franco', 'lucas', 'sanchez', '223-345-4704', 'los dedos');

INSERT INTO Professor (CUIL)
VALUES (856984218);
INSERT INTO Account (CUIL, password)
VALUES (856984218, 'joaquin.ricardo123');
INSERT INTO Personal_Information (CUIL, first_name, second_name, last_name1, last_name2, phone_number, direction)
VALUES (856984218, 'joaquin', 'ricardo', 'celestes', 'primero', '223-345-4705', 'las piernas');