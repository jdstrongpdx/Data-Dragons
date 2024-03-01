-- Note: an asterisk designates that the following variable is user-provIded through the web interface


-- Select Operations

-- Get table of household addresses and Ids for a dropdown
SELECT householdId, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipcode) AS fullAddress FROM Households;

-- Get table of neighborhood names and Ids for a dropdown
SELECT neighborhoodId, neighborhoodName FROM Neighborhoods;

-- Get table of people user names (email) and Ids for a dropdown
SELECT personId, personEmail FROM People;

-- Get table of offer types and Ids for a dropdown
SELECT offerTypeId, offerType FROM OfferTypes;

-- Get table of offers and Ids for a dropdown
SELECT offerId, offerItem FROM Offers;

-- Get table of people with household address instead of householdId
SELECT personId, personName, personEmail, personPhoneNumber, CONCAT(householdAddress, ', ', householdCity, ' ', householdState, ', ', householdZipcode) AS fullAddress, personKarma 
FROM People
INNER JOIN Households ON personHouseholdId = householdId;
ORDER BY personId;

-- Get table of households with neighborhood name instead of neighborhoodId
SELECT householdId, householdAddress, householdCity, householdState, householdZipcode, neighborhoodName 
FROM Households
INNER JOIN Neighborhoods ON neighborhoodId = householdNeighborhoodId
ORDER BY householdId;

-- Get table of offers with person email instead of giverId and offertype name instead of OfferTypeId 
SELECT offerId, personEmail as giverEmail, offerItem, offerDescription, offerQuantity, offerCost, offerTime, offerType
FROM Offers
INNER JOIN People ON offerGiverId = personId
INNER JOIN OfferTypes ON Offers.offerTypeId = OfferTypes.offerTypeId
ORDER BY offerId;

-- Get table of transaction with item name, person email instead of giverId and receiverId
SELECT transactionId, offerItem as item, g.personEmail as giver, r.personEmail as receiver, transactionTime 
FROM Transactions
INNER JOIN Offers ON transactionOfferId = offerId
INNER JOIN People AS g ON g.personId = offerGiverId
INNER JOIN People AS r ON r.personId = transactionReceiverId
ORDER BY transactionId;

-- Create Operations

INSERT INTO Neighborhoods (neighborhoodName)
VALUES (
    '*name');

INSERT INTO Households (householdAddress, householdCity, householdState, householdZipcode, householdNeighborhoodId)
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

INSERT INTO Transactions (transactionOfferId, transactionReceiverId) VALUES
VALUES (
    (SELECT offerId FROM Offers WHERE offerItem = '*item'), 
    (SELECT personId FROM People WHERE personEmail = '*receiverUserName')),
    *time;


-- Update Operations

-- Update an indivIduals information to new values
UPDATE People
SET 
    personName = *newName,
    personEmail = *newEmail,
    personPhoneNumber = *newNumber,
    personHouseholdId = *newHousehold
    personKarma = *newKarma
WHERE
    personId = (SELECT personId FROM People WHERE personEmail = '*updateUserName');


-- Delete Operations

-- Delete an Offer by name, cascade deletes transactions
DELETE FROM Offers WHERE offerId = (SELECT offerId FROM Offers WHERE offerItem = '*itemName');
