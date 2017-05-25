SELECT * FROM `warehouses`
WHERE
`whsId` LIKE "%{{ term }}%" OR
`whsName` LIKE "%{{ term }}%" OR
`address1` LIKE "%{{ term }}%" OR
`address2` LIKE "%{{ term }}%" OR
`city` LIKE "%{{ term }}%" OR
`state` LIKE "%{{ term }}%" OR
`zip` LIKE "%{{ term }}%" OR
`gen_phone` LIKE "%{{ term }}%" OR
`gen_email` LIKE "%{{ term }}%" OR
`ship_phone` LIKE "%{{ term }}%" OR
`ship_email` LIKE "%{{ term }}%" OR
`ship_mgr` LIKE "%{{ term }}%" OR
`rec_phone` LIKE "%{{ term }}%" OR
`rec_email` LIKE "%{{ term }}%" OR
`rec_mgr` LIKE "%{{ term }}%";
