-- Note: an asterisk designates that the following variable is user-provided through the web interface


-- Select Operations

-- Get table of household addresses and IDs for a dropdown
SELECT householdId, householdAddress FROM Households;

-- Get table of neighborhood names and IDs for a dropdown
SELECT neighborhoodId, neighborhoodName FROM Neighborhoods;

-- Get table of people user names (email) and IDs for a dropdown
SELECT personEmail, personName FROM People;

-- Get table of offer types and IDs for a dropdown
SELECT offerTypeId, offerType FROM OfferTypes;

-- Get table of offers and IDs for a dropdown
SELECT offerID, offerItem FROM Offers;

-- Get table of people with their address and neighborhood
SELECT personName, personEmail, householdAddress, householdCity, householdState, householdZipCode, neighborhoodName FROM People
INNER JOIN Households ON personHouseholdID = householdID
INNER JOIN Neighborhoods ON householdNeighborhoodId = neighborhoodID;

-- Get table of transaction items, giver, and receiver
SELECT offerItem as Item, g.personName as Giver, r.personName as Receiver FROM Transactions
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
    (SELECT householdId FROM Households WHERE householdAddress = '*address' AND householdCity = '*city' AND householdState = '*state' AND householdZipcode = '*zip'));

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
    (SELECT offerTypeId FROM OfferTypes WHERE offerType = '*offerTypeName'));

INSERT INTO Transactions (transactionOfferID, transactionReceiverID) VALUES
VALUES (
    (SELECT offerID FROM Offers WHERE offerItem = '*item'), 
    (SELECT personId FROM People WHERE personEmail = '*receiverUserName'));


-- Update Operations

-- Update an individuals email, phone, or address if one is provided, otherwise maintain the current one
UPDATE People
SET 
    personEmail = IsNull(*newEmail, '*updateUserName'),
    personPhoneNumber = IsNull(*newNumber, (SELECT personPhoneNumber FROM People WHERE personEmail = '*updateUserName')),
    personHouseholdId = IsNull(*newHousehold, (SELECT personHouseholdId FROM People WHERE personEmail = '*updateUserName'))
WHERE
    personID = (SELECT personId FROM People WHERE personEmail = '*updateUserName');

-- Update a transaction
UPDATE Transactions
SET
    transactionOfferID = (SELECT offerID FROM Offers WHERE offerItem = '*newItem'),
    transactionRecieverID = (SELECT personId FROM People WHERE personEmail = '*receiverUserName')
WHERE
    transactionId = *id;


-- Delete Operations

-- Delete all transactions involving a particular offer
DELETE FROM Transactions WHERE transactionOfferID = (SELECT offerID FROM Offers WHERE offerItem = '*itemVoided');

-- Delete all transactions involving a particular buyer
DELETE FROM Transactions WHERE transactionReceiverID = (SELECT personId FROM People WHERE personEmail = '*personUserNameVoided');

-- Delete a particular transaction
DELETE FROM Transactions WHERE 
transactionOfferID = (SELECT offerID FROM Offers WHERE offerItem = '*itemVoided')
AND transactionReceiverID = (SELECT personId FROM People WHERE personEmail = '*personUserNameVoided');