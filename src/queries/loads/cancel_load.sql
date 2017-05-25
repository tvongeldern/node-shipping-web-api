UPDATE `loads`
SET `status`=<< load_statuses.cancelled >>
WHERE `loadId`={{ load }};
