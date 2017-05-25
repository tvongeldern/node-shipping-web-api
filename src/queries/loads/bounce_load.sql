UPDATE `loads`
SET `status`=<< load_statuses.available >>
WHERE `loadId`={{ load }};
