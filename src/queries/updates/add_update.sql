INSERT INTO `location_updates`
(
    `lat`, `lon`, `driver`
)
VALUES
(
    {{ lat }}, {{ lon }}, {{ driver }}
);
