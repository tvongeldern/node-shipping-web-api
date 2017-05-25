START TRANSACTION;

UPDATE `stops`
SET `status`=<< stop_statuses.at_location >>
WHERE `stopId`={{ stop }};

[#if first]
UPDATE `loads`
SET `status`=<< load_statuses.loading >>
WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopId`={{ stop }} );
[/if first]

[#if last]
UPDATE `loads`
SET `status`=<< load_statuses.unloading >>
WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopId`={{ stop }} );
[/if last]

COMMIT;
