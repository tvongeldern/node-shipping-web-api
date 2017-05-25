SELECT EXISTS
(
    SELECT * FROM `warehouses` WHERE whsId={{ whsId }}
)
AS `exists`;
