SELECT EXISTS
(
    SELECT `stopId`
    FROM `stops`
    WHERE `stopId`={{ stopId }} AND `loadId`={{ loadId }}
)
AS `exists`
