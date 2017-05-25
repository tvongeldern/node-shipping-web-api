START TRANSACTION;
UPDATE `stops`
SET `status`=<< stop_statuses.en_route >>
WHERE `stopId`={{ stop }};
[#if first]
UPDATE `loads`
SET `status`=<< load_statuses.checked_in >>
WHERE `loadId`=( SELECT `loadId` FROM `stops` WHERE `stopId`={{ stop }} );
[/if first]
COMMIT;
