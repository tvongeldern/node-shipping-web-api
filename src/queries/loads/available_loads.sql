SELECT loads.*,
JSON_ARRAY(
    group_concat(
        DISTINCT
        JSON_OBJECT(
        	'stopId', stops.stopId,
        	'action', stops.action,
        	'status', stops.status,
        	'earlyTime', stops.earlyTime,
        	'lateTime', stops.lateTime,
        	'earlyDate', stops.earlyDate,
        	'lateDate', stops.lateDate,
        	'whsId', warehouses.whsId,
        	'city', warehouses.city,
        	'state', warehouses.state,
        	'zip', warehouses.zip
        )
        ORDER BY stops.stopId
    ),
) AS `stops`,
COUNT(DISTINCT bids.bidId) as `bid_count`
FROM `loads`
LEFT JOIN `stops` ON loads.loadId = stops.loadId
LEFT JOIN `warehouses` ON warehouses.whsId = stops.whsId
LEFT JOIN `bids` ON bids.loadId = loads.loadId
WHERE loads.status=<< load_statuses.available >>
GROUP BY loads.loadId;
