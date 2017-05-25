SELECT @target_loadId := bids.loadId FROM `bids` WHERE `bidId`={{ bid }};
UPDATE `loads`
SET `status`=<< load_statuses.booked >>, `carrier`={{ carrier }}
WHERE `loadId`= @target_loadId;
UPDATE `stops`
INNER JOIN `bid_stop_adjustments` AS `adj` ON stops.stopId=adj.stopId AND adj.bidId={{ bid }}
SET stops.earlyTime=IFNULL(adj.new_time, stops.earlyTime),
stops.lateTime=IFNULL(adj.new_time, stops.lateTime),
stops.earlyDate=IFNULL(adj.new_date, stops.earlyDate),
stops.lateDate=IFNULL(adj.new_date, stops.lateDate)
WHERE stops.loadId=@target_loadId;
SELECT @driver := bids.driver FROM `bids` WHERE `bidId`={{ bid }};
UPDATE `bids`
INNER JOIN
(
	SELECT stopId, earlyDate, lateDate, loadId,
	@early_date := earlyDate,
	@late_date := lateDate
	FROM stops
	ORDER BY stopId ASC
	LIMIT 1
) AS `stop` ON stop.loadId=bids.loadId
SET `status`=<< bid_statuses.inactive >>
WHERE bids.driver IS NOT NULL AND bids.loadId=@target_loadId AND bids.driver=@driver AND (stop.earlyDate=@early_date OR stop.lateDate=@late_date);
UPDATE `bids`
SET `status`=<< bid_statuses.accepted >>
WHERE `bidId`={{ bid }};
COMMIT;
