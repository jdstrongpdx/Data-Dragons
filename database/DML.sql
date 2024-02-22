-- Note: an asterisk designates that the following variable is user-provided through the web interface


-- Select Operations

-- Get table of household addresses and IDs for a dropdown
SELECT householdID, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress FROM Households;

-- Get table of neighborhood names and IDs for a dropdown
SELECT neighborhoodId, neighborhoodName FROM Neighborhoods;

-- Get table of people user names (email) and IDs for a dropdown
SELECT personID, personEmail FROM People;

-- Get table of offer types and IDs for a dropdown
SELECT offerTypeId, offerType FROM OfferTypes;

-- Get table of offers and IDs for a dropdown
SELECT offerID, offerItem FROM Offers;

-- Get table of people with household address instead of householdID
SELECT personID, personName, personEmail, personPhoneNumber, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipCode) AS fullAddress, personKarma 
FROM People
INNER JOIN Households ON personHouseholdID = householdID;

-- Get table of households with neighborhood name instead of neighborhoodID
SELECT householdID, householdAddress, householdCity, householdState, householdZipCode, neighborhoodName 
FROM Households
INNER JOIN Neighborhoods ON neighborhoodID = householdNeighborhoodId;

-- Get table of offers with person email instead of giverID and offertype name instead of OfferTypeID 
SELECT offerID, personEmail as giverEmail, offerItem, offerDescription, offerQuantity, offerCost, offerTime, offerType
FROM Offers
INNER JOIN People ON offerGiverId = personID
INNER JOIN OfferTypes ON Offers.offerTypeId = OfferTypes.offerTypeId;

-- Get table of transaction with item name, person email instead of giverID and receiverID
SELECT transactionID, offerItem as Item, g.personName as Giver, r.personName as Receiver, transactionTime 
FROM Transactions
INNER JOIN Offers ON transactionOfferID = offerID
INNER JOIN People AS g ON g.personId = offerGiverID
INNER JOIN People AS r ON r.personID = transactionReceiverId;

-- Create Operations

INSERT INTO Neighborhoods (neighborhoodName)
VALUES (
    '*name');

INSERT INTO Households (householdAddress, householdCity, householdState, householdZipCode, householdNeighborhoodId)
VALUES (
    '*address', 
    '*city', 
    '*state', 
    '*zip', 
    (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = '*neighborhoodName'));

INSERT INTO People (personName, personEmail, personPhoneNumber, personHouseholdId)
VALUES (
    '*name', 
    '*email', 
    '*phone',
    (SELECT householdId FROM Households WHERE householdAddress = '*address' AND householdCity = '*city' AND householdState = '*state' AND householdZipcode = '*zip')),
    *karma;

INSERT INTO OfferTypes (offerType)
VALUES (
    '*type');

INSERT INTO Offers (offerGiverId, offerItem, offerDescription, offerQuantity, offerCost, offerTypeId)
VALUES (
    (SELECT personId FROM People WHERE personEmail = '*giverUserName'), 
    '*item', 
    '*description', 
    *quantity, 
    *cost, 
    *time,
    (SELECT offerTypeId FROM OfferTypes WHERE offerType = '*offerTypeName'));

INSERT INTO Transactions (transactionOfferID, transactionReceiverID) VALUES
VALUES (
    (SELECT offerID FROM Offers WHERE offerItem = '*item'), 
    (SELECT personId FROM People WHERE personEmail = '*receiverUserName')),
    *time;


-- Update Operations

-- Update an individuals information to new values
UPDATE People
SET 
    personName = *newName,
    personEmail = *newEmail,
    personPhoneNumber = *newNumber,
    personHouseholdId = *newHousehold
    personKarma = *newKarma
WHERE
    personID = (SELECT personId FROM People WHERE personEmail = '*updateUserName');


-- Delete Operations

-- Delete an Offer by name, cascade deletes transactions
DELETE FROM Offers WHERE offerID = (SELECT offerID FROM Offers WHERE offerItem = '*itemName');
