SELECT EXISTS
(
    SELECT `stopId`
    FROM `stops`
    WHERE `stopId`={{ stop }}
    AND `status`=<< stop_statuses.en_route >>
) AS `exists`,
NOT EXISTS (
    SELECT `stopId`
    FROM `stops`
    WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopID`={{ stop }} )
    AND `stopId` < {{ stop }}
) AS `first`,
NOT EXISTS (
    SELECT `stopId`
    FROM `stops`
    WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopID`={{ stop }} )
    AND `stopId` > {{ stop }}
) AS `last`;
