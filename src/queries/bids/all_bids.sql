SELECT
bids.bidId, bids.rate, bids.weight, bids.handling, bids.driver, bids.counterTo,
IF (
    COUNT(adj.adjustmentId) > 0,
    JSON_ARRAY(
        group_concat(
            JSON_OBJECT(
                'adjustmentId', adj.adjustmentId,
                'stopId', IFNULL(adj.stopId, 'null'),
                'newTime', IFNULL(adj.new_time, 'null'),
                'newDate', IFNULL(adj.new_date, 'null'),
                'margin', IFNULL(adj.plus_minus_minutes, 'null')
            )
        )
    ),
    JSON_ARRAY()
) AS stopChanges

[#if load]
FROM bids
LEFT JOIN bid_stop_adjustments AS adj ON adj.bidId = bids.bidId
WHERE bids.loadId={{ load }}
[/if load]

[#if bid]
FROM bids
LEFT JOIN bid_stop_adjustments AS adj ON adj.bidId = bids.bidId
WHERE bids.bidId={{ bid }}
[/if bid]

[#if bidder]
FROM bids
LEFT JOIN bid_stop_adjustments AS adj ON adj.bidId = bids.bidId
WHERE bids.bidAgent={{ bidder }}
[/if bidder]

[#if customer]
FROM loads
INNER JOIN bids ON bids.loadId=loads.loadId
LEFT JOIN bid_stop_adjustments AS adj ON adj.bidId=bids.bidId
WHERE loads.customer={{ customer }}
[/if customer]

GROUP BY bids.bidId;
