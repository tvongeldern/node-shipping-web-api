UPDATE `stops`
SET `status`=<< stop_statuses.being_worked >>
WHERE `stopId`={{ stop }};
