SELECT EXISTS
(
    SELECT `bidId`
    FROM `bids`
    WHERE `bidId`={{ counterTo }}
    AND `bidAgent`!={{ bidAgent }}
    AND `status`=<< bid_statuses.active >>
    AND `carrier`= {{ carrier }}
)
AS `exists`;
