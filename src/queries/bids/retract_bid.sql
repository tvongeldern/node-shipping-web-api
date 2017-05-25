UPDATE `bids`
SET `status`=<< bid_statuses.retracted >>
WHERE `bidId`={{ bid }};
