SELECT EXISTS
(
    SELECT `bidId` FROM `bids` WHERE `bidId`={{ bid }}
)
AS `exists`;
