CREATE DATABASE quadB;

USE quadB;

CREATE TABLE hodlinfo_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  last DECIMAL(10, 2),
  buy DECIMAL(10, 2),
  sell DECIMAL(10, 2),
  volume DECIMAL(20, 8),
  base_unit VARCHAR(10)
);
