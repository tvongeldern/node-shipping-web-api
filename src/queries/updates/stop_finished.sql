START TRANSACTION;

UPDATE `stops`
SET `status`=<< stop_statuses.finished >>
WHERE `stopId`={{ stop }};

SET @next_stop=( SELECT `stopId` FROM `stops` WHERE `stopId` > {{ stop }}
	AND `loadId` = ( SELECT `loadId` FROM `stops` WHERE `stopId`={{ stop }} )
	ORDER BY `stopId` ASC LIMIT 1 );

UPDATE `stops`
SET `status`=<< stop_statuses.en_route >>
WHERE `stopId`=@next_stop;

[#if first]
UPDATE `loads`
SET `status`=<< load_statuses.in_transit >>
WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopId`={{ stop }} );
[/if first]

[#if last]
UPDATE `loads`
SET `status`=<< load_statuses.delivered >>
WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopId`={{ stop }} );
[/if last]

COMMIT;
