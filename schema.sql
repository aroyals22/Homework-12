USE employees_db
INSERT INTO dept (name)
VALUES ("Engineering"),("Marketing"),("Sales"),("Operations");

INSERT INTO role ( title,salary, dept_id)
VALUES ("Engr Leader", 90000, 1), ("Engr", 80000, 1), ("Mkt Leader", 65000, 2), ("Mkt Coordinator", 50000, 2),("Sales leader", 75000, 3), ("salesman", 55000, 3);

INSERT INTO employee(first_name,last_name,rold_id,manager_id)
VALUES ("Amy", "Amyson", 1,null), ("Bob","Bobson",2,1),("Cathy","Cathymon", 2,null),("Dave","Daveson",4,3),("Emily","Emmers", 5, null)("Fred","Fredders",6,5),("Gabe","Gabeson", 7,NULL),("Hank","Hankers",8,7);
