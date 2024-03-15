-- Group 19
-- Project Name: CloseKnit Bazaar
-- Mike Meller and Joel Strong
-- This DDL file is the skeleton for the CloseKnit Bazaar database design. It implements the schema for the database and inserts sample data to demonstrate usage.

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table `Neighborhoods`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Neighborhoods` ;

CREATE TABLE IF NOT EXISTS `Neighborhoods` (
  `neighborhoodId` INT NOT NULL AUTO_INCREMENT,
  `neighborhoodName` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`neighborhoodId`)
);

INSERT INTO Neighborhoods (neighborhoodName)
VALUES ('Maplewood Heights'),
('Willow Creek Gardens'),
('Pinecrest Meadows');

-- -----------------------------------------------------
-- Table `Households`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Households` ;

CREATE TABLE IF NOT EXISTS `Households` (
  `householdId` INT NOT NULL AUTO_INCREMENT,
  `householdAddress` VARCHAR(75) NOT NULL,
  `householdCity` VARCHAR(75) NOT NULL, 
  `householdState` VARCHAR (50) NOT NULL,
  `householdZipcode` VARCHAR (15) NOT NULL,
  `householdNeighborhoodId` INT NOT NULL,
  PRIMARY KEY (`householdId`),
  FOREIGN KEY (`householdNeighborhoodId`) REFERENCES `Neighborhoods` (`neighborhoodId`),
  UNIQUE `unique_address` (`householdAddress`, `householdCity`, `householdState`, `householdZipcode`)
  );

INSERT INTO Households (householdAddress, householdCity, householdState, householdZipcode, householdNeighborhoodId) VALUES
('123 Maple Street', 'Oakdale', 'California', '95361', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Maplewood Heights')),
('456 Willow Avenue', 'Oakdale', 'California', '95361', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Maplewood Heights')),
('789 Pinecrest Lane', 'Oakdale', 'California', '95361', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Maplewood Heights')),
('101 Oakridge Drive', 'Lexington', 'Kentucky', '40502', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Willow Creek Gardens')),
('202 Harborview Boulevard', 'Lexington', 'Kentucky', '40502', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Willow Creek Gardens')),
('303 Sunset Road', 'Lexington', 'Kentucky', '40502', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Willow Creek Gardens')),
('404 Riverfront Street', 'Brighton', 'Colorado', '80601', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Pinecrest Meadows')),
('505 Cedar Grove Avenue', 'Brighton', 'Colorado', '80601', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Pinecrest Meadows')),
('606 Lakeside Court', 'Brighton', 'Colorado', '80601', (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = 'Pinecrest Meadows'));

-- -----------------------------------------------------
-- Table `People`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `People` ;

CREATE TABLE IF NOT EXISTS `People` (
  `personId` INT NOT NULL AUTO_INCREMENT,
  `personName` VARCHAR(75) NOT NULL,
  `personEmail` VARCHAR(75) NOT NULL UNIQUE,
  `personPhoneNumber` VARCHAR(45) NOT NULL UNIQUE,
  `personHouseholdId` INT NULL,
  `personKarma` INT NOT NULL DEFAULT 100,
  PRIMARY KEY (`personId`),
  FOREIGN KEY (`personHouseholdId`) REFERENCES `Households`(`householdId`)
  );

INSERT INTO People (personName, personEmail, personPhoneNumber, personHouseholdId) VALUES
('John Smith', 'john.smith@example.com', '111-555-1234', (SELECT householdId FROM Households WHERE householdAddress = '123 Maple Street' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361')),
('Jane Smith', 'jane.smith@example.com', '111-555-5678', (SELECT householdId FROM Households WHERE householdAddress = '123 Maple Street' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361')),
('Robert Johnson', 'robert.johnson@example.com', '111-555-8765', (SELECT householdId FROM Households WHERE householdAddress = '456 Willow Avenue' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361')),
('Emily Johnson', 'emily.johnson@example.com', '222-555-4321', (SELECT householdId FROM Households WHERE householdAddress = '456 Willow Avenue' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361')),
('Michael Brown', 'michael.brown@example.com', '222-555-9876', (SELECT householdId FROM Households WHERE householdAddress = '789 Pinecrest Lane' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361')),
('Sarah Davis', 'sarah.davis@example.com', '222-555-2345', (SELECT householdId FROM Households WHERE householdAddress = '101 Oakridge Drive' AND householdCity = 'Lexington' AND householdState = 'Kentucky' AND householdZipcode = '40502')),
('Christopher Miller', 'christopher.miller@example.com', '333-555-5432', (SELECT householdId FROM Households WHERE householdAddress = '202 Harborview Boulevard' AND householdCity = 'Lexington' AND householdState = 'Kentucky' AND householdZipcode = '40502')),
('Olivia Wilson', 'olivia.wilson@example.com', '333-555-7654', (SELECT householdId FROM Households WHERE householdAddress = '303 Sunset Road' AND householdCity = 'Lexington' AND householdState = 'Kentucky' AND householdZipcode = '40502')),
('Ava Anderson', 'ava.anderson@example.com', '333-555-8765', (SELECT householdId FROM Households WHERE householdAddress = '404 Riverfront Street' AND householdCity = 'Brighton' AND householdState = 'Colorado' AND householdZipcode = '80601')),
('Ethan Martinez', 'ethan.martinez@example.com', '444-555-9876', (SELECT householdId FROM Households WHERE householdAddress = '505 Cedar Grove Avenue' AND householdCity = 'Brighton' AND householdState = 'Colorado' AND householdZipcode = '80601')),
('Mia Taylor', 'mia.taylor@example.com', '444-555-3456', (SELECT householdId FROM Households WHERE householdAddress = '606 Lakeside Court' AND householdCity = 'Brighton' AND householdState = 'Colorado' AND householdZipcode = '80601')),
('Liam Taylor', 'liam.taylor@example.com', '444-555-6543', (SELECT householdId FROM Households WHERE householdAddress = '606 Lakeside Court' AND householdCity = 'Brighton' AND householdState = 'Colorado' AND householdZipcode = '80601')),
('Sophia Taylor', 'sophia.taylor@example.com', '555-555-7890', (SELECT householdId FROM Households WHERE householdAddress = '606 Lakeside Court' AND householdCity = 'Brighton' AND householdState = 'Colorado' AND householdZipcode = '80601')),
('Andrew Brown', 'andrew.brown@example.com', '555-555-8901', (SELECT householdId FROM Households WHERE householdAddress = '789 Pinecrest Lane' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361')),
('Grace Wilson', 'grace.wilson@example.com', '555-555-9012', (SELECT householdId FROM Households WHERE householdAddress = '303 Sunset Road' AND householdCity = 'Lexington' AND householdState = 'Kentucky' AND householdZipcode = '40502')),
('Samuel Miller', 'samuel.miller@example.com', '666-555-2109', (SELECT householdId FROM Households WHERE householdAddress = '202 Harborview Boulevard' AND householdCity = 'Lexington' AND householdState = 'Kentucky' AND householdZipcode = '40502')),
('Emma Davis', 'emma.davis@example.com', '666-555-1098', (SELECT householdId FROM Households WHERE householdAddress = '101 Oakridge Drive' AND householdCity = 'Lexington' AND householdState = 'Kentucky' AND householdZipcode = '40502')),
('Lucas Johnson', 'lucas.johnson@example.com', '666-555-3210', (SELECT householdId FROM Households WHERE householdAddress = '456 Willow Avenue' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361')),
('Chloe Smith', 'chloe.smith@example.com', '666-555-4321', (SELECT householdId FROM Households WHERE householdAddress = '123 Maple Street' AND householdCity = 'Oakdale' AND householdState = 'California' AND householdZipcode = '95361'));

-- -----------------------------------------------------
-- Table `OfferTypes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OfferTypes` ;

CREATE TABLE IF NOT EXISTS `OfferTypes` (
  `offerTypeId` INT NOT NULL AUTO_INCREMENT,
  `offerType` VARCHAR(45) NOT NULL UNIQUE,
  PRIMARY KEY (`offerTypeId`)
);

INSERT INTO OfferTypes (offerType) 
VALUES 
('Service - House Cleaning'),
('Service - Lawn Care'), 
('Service - Pet Care'), 
('Service - Housesitting'),
('Goods - Tools'),
('Goods - Outdoor Equipment'),
('Goods - Power Tools/Equipment'),
('Goods - Fitness Equipment');

-- -----------------------------------------------------
-- Table `Offers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Offers` ;

CREATE TABLE IF NOT EXISTS `Offers` (
  `offerId` INT NOT NULL AUTO_INCREMENT,
  `offerGiverId` INT NOT NULL,
  `offerItem` VARCHAR(45) NOT NULL,
  `offerDescription` VARCHAR(500) NULL,
  `offerQuantity` INT NOT NULL DEFAULT 1,
  `offerCost` INT NOT NULL,
  `offerTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `offerTypeId` INT NOT NULL,
  PRIMARY KEY (`offerId`),
  FOREIGN KEY (`offerTypeId`) REFERENCES `OfferTypes` (`offerTypeId`),
  FOREIGN KEY (`offerGiverId`) REFERENCES `People` (`personId`)
  );
  

INSERT INTO Offers (offerGiverId, offerItem, offerDescription, offerQuantity, offerCost, offerTypeId) VALUES
((SELECT personId FROM People WHERE personEmail = 'john.smith@example.com'), '10mm Socket Head', 'Borrow my 10mm Socket Head - Just don''t lose it', 
1, 10, (SELECT offerTypeId FROM OfferTypes WHERE offerType = 'Goods - Tools')),

((SELECT personId FROM People WHERE personEmail = 'mia.taylor@example.com'), 'Dog Walking', '30 minute mid-day walk for up to two well behaved dogs', 
4, 30, (SELECT offerTypeId FROM OfferTypes WHERE offerType = 'Service - Pet Care')),

((SELECT personId FROM People WHERE personEmail = 'emma.davis@example.com'), 'Yoga Equipment', 'Yoga equipment including blocks, bands, balls, and mat.', 
2, 25, (SELECT offerTypeId FROM OfferTypes WHERE offerType = 'Goods - Fitness Equipment'));

-- -----------------------------------------------------
-- Table `Transactions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Transactions` ;

CREATE TABLE IF NOT EXISTS `Transactions` (
  `transactionId` INT NOT NULL AUTO_INCREMENT,
  `transactionOfferId` INT NOT NULL,
  `transactionReceiverId` INT NOT NULL,
  `transactionTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transactionID`),
  FOREIGN KEY (`transactionOfferID`) REFERENCES `Offers` (`offerId`) ON DELETE CASCADE,
  FOREIGN KEY (`transactionReceiverID`) REFERENCES `People` (`personId`)
  );

INSERT INTO Transactions (transactionOfferID, transactionReceiverID) VALUES
(1, (SELECT personId FROM People WHERE personEmail = 'michael.brown@example.com')),
(2, (SELECT personId FROM People WHERE personEmail = 'ava.anderson@example.com')),
(3, (SELECT personId FROM People WHERE personEmail = 'grace.wilson@example.com'));


SET FOREIGN_KEY_CHECKS=1;
COMMIT;