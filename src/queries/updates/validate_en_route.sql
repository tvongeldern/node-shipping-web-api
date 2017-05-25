SELECT
EXISTS
    (
        SELECT `stopId`
        FROM `stops`
        WHERE `stopId`={{ stop }}
        AND `status`=<< stop_statuses.not_started >>
    )
AS `exists`,
EXISTS
    (
        SELECT `stopId`
        FROM `stops`
        WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopId`= {{ stop }} )
        AND `stopId` < {{ stop }}
    )
AS `not_first`;
