CREATE TABLE iam_aup (ID BIGINT AUTO_INCREMENT NOT NULL, 
  creation_time DATETIME NOT NULL, description VARCHAR(128), last_update_time DATETIME NOT NULL, 
  name VARCHAR(36) NOT NULL UNIQUE, 
  sig_validity_days BIGINT NOT NULL, 
  text LONGTEXT NOT NULL, 
  PRIMARY KEY (ID));