SELECT EXISTS
(
    SELECT `whsId`
    FROM `warehouses`
    WHERE `zip`={{ zip }} AND `address1` LIKE "%{{ address1 }}%"
)
AS `exists`
