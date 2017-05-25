SELECT EXISTS
(
    SELECT `bidId`
    FROM `bids`
    WHERE `status`=<< bid_statuses.active >>
) AS `exists`;
