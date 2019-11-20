DROP DATABASE IF EXISTS marine_biology_db;

CREATE DATABASE marine_biology_db;

\c marine_biology_db;

-- researchers table
CREATE TABLE researchers
(
    id SERIAL PRIMARY KEY,
    researcher_name VARCHAR NOT NULL UNIQUE,
    job_title VARCHAR NOT NULL
);

-- Species table
CREATE TABLE species
(
    id SERIAl PRIMARY KEY,
    species_name VARCHAR NOT NULL,
    is_mammal BOOLEAN
);

CREATE TABLE animals
(
    id SERIAl PRIMARY KEY,
    species_id INT REFERENCES species(id) ON UPDATE CASCADE,
    nickname VARCHAR NOT NULL
);

-- Habitat table
CREATE TABLE habitats
(
    id SERIAL PRIMARY KEY,
    category VARCHAR NOT NULL
);

-- sightings table
CREATE TABLE sightings
(
    id SERIAl PRIMARY KEY,
    researcher_id INT REFERENCES researchers(id) ON DELETE SET NULL,
    species_id INT REFERENCES species(id) ON DELETE CASCADE,
    habitat_id INT REFERENCES habitats(id) ON UPDATE CASCADE
);


INSERT INTO researchers
    (researcher_name,job_title)
VALUES
    ('Mariana Aleta', 'Project Lead'),
    ('Javed Patrick', 'Senior Field Researcher'),
    ('Carolina Itai', ' Field Researcher'),
    ('Jazmyn Gottfried', 'Field Researcher'),
    ('Ezra Flip', 'Research Intern');

INSERT INTO species
    (species_name,is_mammal)
VALUES
    ('Dolphin', true),
    ('Moray Eel', false),
    ('Tiger Shark', false),
    ('Orca Whale', true),
    ('Moon Jelly', false);

INSERT INTO animals
    (species_id,nickname)
VALUES
    (1, 'FLip'),
    (1, 'Skip'),
    (2, 'Jenkins'),
    (3, 'Sally'),
    (5, 'Flapjack'),
    (5, 'Gibbous'),
    (5, 'Nox');

INSERT INTO habitats
    (category)
VALUES
    ('Shallows'),
    ('Coral Reef'),
    ('Tide Pools'),
    ('Deeps');

INSERT INTO sightings
    (species_id, researcher_id, habitat_id)
VALUES
    (4, 4, 4),-- An Orca Whale was spotted by Jazmyn Gottfried in the Deeps.
    (3, 1, 4),-- A Tiger Shark was spotted by Mariana Aleta in the Deeps.
    (5, 3, 3),-- A Moon Jelly was spotted by Carolina Itai in the Tide Pools.
    (2, 5, 2),-- A Moray Eel was spotted by Ezra Flip in the Coral Reef.
    (1, 2, 1),-- A Dolphin was spotted by Javed Patrick in the Shallows.
    (2, 5, 1);  -- A Moray Eel was spotted by Ezra Flip in the Shallows.

  