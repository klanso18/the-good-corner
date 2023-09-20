/* AD */

DROP TABLE IF EXISTS ad;

CREATE TABLE ad 
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
	title VARCHAR(100) NOT NULL,
	description TEXT,
	owner VARCHAR(100) NOT NULL,
	price REAL,
  picture VARCHAR(255),
  location VARCHAR(100),
	createdAt DATE,
	category_id INT,
  CONSTRAINT fk_ad_category FOREIGN KEY (category_id) REFERENCES category(id)
);

INSERT INTO ad (title, owner, price, location, createdAt, category_id) VALUES 
    ('Macbook pro M2', 'Michel', 1000, 'Bordeaux', '2023-09-09', 3),
    ('Vélo de ville', 'Jean', 200, 'Lyon', '2023-09-05', 4),
    ('Veste de ski', 'Manu', 50, 'Paris', '2023-09-15', 1),
    ('Console PS4', 'Marc', 250, 'Bordeaux', '2023-09-17', 3),
    ('Chaussures de basket', 'Victor', 50, 'Paris', '2023-09-13', 1),
    ('Twingo', 'Jules', 3000, 'Lyon', '2023-09-11', 2),
    ('Renault Espace', 'Jacques', 5000, 'Bordeaux', '2023-09-04', 2),
    ('Console switch', 'Paul', 100, 'Lyon', '2023-09-19', 3),
    ('Dell 16 pouces', 'Julie', 200, 'Paris', '2023-09-04', 3);


SELECT * FROM ad; 

SELECT * FROM ad WHERE location = 'Bordeaux';

DELETE FROM ad WHERE price > 40; 

UPDATE ad SET price = 0 WHERE createdAt = '2023-09-01';

SELECT AVG(price) FROM ad WHERE location = 'Paris';

SELECT location, AVG(price) as 'prix moyen des annonces' FROM ad GROUP BY location;


/* CATEGORY */

DROP TABLE IF EXISTS category;

CREATE TABLE category
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100),
);

INSERT INTO category (name) VALUES 
  ('vêtement'), 
  ('voiture'), 
  ('multimédia'), 
  ('autres');

SELECT * FROM ad AS a INNER JOIN category AS c ON c.id = a.category_id WHERE c.name = 'vêtement';

SELECT * FROM ad AS a INNER JOIN category AS c ON c.id = a.category_id WHERE c.name = 'vêtement' AND c.name = 'voiture';

SELECT AVG(price) FROM ad AS a INNER JOIN category AS c ON c.id = a.category_id WHERE c.name = 'autre';

SELECT * FROM ad AS a INNER JOIN category AS c ON c.id = a.category_id WHERE c.name LIKE 'v%';


