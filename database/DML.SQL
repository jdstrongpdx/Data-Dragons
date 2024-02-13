-- Note: an asterisk designates that the following variable is user-provided through the web interface\


-- Select Operations

-- Get table of household addresses and IDs for a dropdown
SELECT householdId, householdAddress FROM Households;

-- Get table of neighborhood names and IDs for a dropdown
SELECT neighborhoodId, neighborhoodName FROM Neighborhoods;

-- Get table of people names and IDs for a dropdown
SELECT personID, personName FROM People;

-- Get table of offer types and IDs for a dropdown
SELECT offerTypeId, offerType FROM OfferTypes;

-- Get table of offers and IDs for a dropdown
SELECT offerID, offerItem FROM Offers;


-- Create Operations

INSERT INTO Neighborhoods (neighborhoodName)
VALUES (
    *name);

INSERT INTO Households (householdAddress, householdCity, householdState, householdZipCode, householdNeighborhoodId)
VALUES (
    '*address', 
    '*city', 
    '*state', 
    '*zip', 
    (SELECT neighborhoodId FROM Neighborhoods WHERE neighborhoodName = '*neighborhoodName'));

INSERT INTO People (personName, personEmail, personPhoneNumber, personHouseholdId)
VALUES (
    *name, 
    *email, 
    *phone,
    (SELECT householdId FROM Households WHERE householdAddress = '*address' AND householdCity = '*city' AND householdState = '*state' AND householdZipcode = '*zip'));

INSERT INTO OfferTypes (offerType)
VALUES (
    *type);

INSERT INTO Offers (offerGiverId, offerItem, offerDescription, offerQuantity, offerCost, offerTypeId)
VALUES (
    (SELECT personId FROM People WHERE personName = '*giverName'), 
    *item, 
    *description, 
    *quantity, 
    *cost, 
    (SELECT offerTypeId FROM OfferTypes WHERE offerType = '*offerTypeName'));

INSERT INTO Transactions (transactionOfferID, transactionRecieverID) VALUES
VALUES (
    (SELECT offerID FROM Offers WHERE offerItem = '*item'), 
    (SELECT personId FROM People WHERE personName = '*receiverName'));


-- Update Operations

-- Update an individuals email, phone, or address if one is provided, otherwise maintain the current one
UPDATE People
SET 
    personEmail = IsNull(*newEmail, (SELECT personEmail FROM People WHERE personName = '*updateName')),
    personPhoneNumber = IsNull(*newEmail, (SELECT personPhoneNumber FROM People WHERE personName = '*updateName')),
    personHouseholdId = IsNull(*newEmail, (SELECT personHouseholdId FROM People WHERE personName = '*updateName'))
WHERE
    personID = (SELECT personId FROM People WHERE personName = '*updateName');

-- Update a transaction
UPDATE Transactions
SET
    transactionOfferID = (SELECT offerID FROM Offers WHERE offerItem = '*newItem'),
    transactionRecieverID = (SELECT personId FROM People WHERE personName = '*receiverName')
WHERE
    transactionId = *id;


-- Delete Operations

-- Delete all transactions involving a particular offer
DELETE FROM Transactions WHERE transactionOfferID = (SELECT offerID FROM Offers WHERE offerItem = '*itemVoided');

-- Delete all transactions involving a particular buyer
DELETE FROM Transactions WHERE transactionRecieverID = (SELECT personId FROM People WHERE personName = '*personVoided');

-- Delete a particular transaction
DELETE FROM Transactions WHERE 
transactionOfferID = (SELECT offerID FROM Offers WHERE offerItem = '*itemVoided')
AND transactionRecieverID = (SELECT personId FROM People WHERE personName = '*personVoided');
