SELECT EXISTS
(
    SELECT `stopId`
    FROM `stops`
    WHERE `stopId`={{ stop }}
    AND `status`=<< stop_statuses.at_location >>
) AS `exists`;
