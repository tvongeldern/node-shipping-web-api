CREATE TABLE `stops` (
  `stopId` int(11) NOT NULL AUTO_INCREMENT,
  `loadId` int(11) NOT NULL,
  `action` int(1) NOT NULL,
  `whsId` int(11) NOT NULL,
  `status` int(1) DEFAULT '0',
  `earlyTime` time NOT NULL,
  `earlyDate` date NOT NULL,
  `lateTime` time NOT NULL,
  `lateDate` date NOT NULL,
  PRIMARY KEY (`stopId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8