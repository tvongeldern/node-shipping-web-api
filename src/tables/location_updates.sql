CREATE TABLE `location_updates` (
  `updateId` bigint(20) NOT NULL AUTO_INCREMENT,
  `lat` decimal(10,8) DEFAULT NULL,
  `lon` decimal(11,8) DEFAULT NULL,
  `ts` datetime DEFAULT CURRENT_TIMESTAMP,
  `driver` int(11) DEFAULT NULL,
  PRIMARY KEY (`updateId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8