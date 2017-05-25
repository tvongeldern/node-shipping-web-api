CREATE TABLE `loads` (
  `loadId` int(11) NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) DEFAULT '1',
  `weight` int(11) DEFAULT NULL,
  `handling` tinyint(1) DEFAULT NULL,
  `hazmat` tinyint(1) DEFAULT NULL,
  `unNumber` varchar(10) DEFAULT NULL,
  `commodity` varchar(100) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `customer` int(11) NOT NULL,
  `carrier` int(11) DEFAULT NULL,
  `rate` int(5) DEFAULT NULL,
  `driver` int(11) DEFAULT NULL,
  PRIMARY KEY (`loadId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8