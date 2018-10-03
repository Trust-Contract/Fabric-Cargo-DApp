create database blockchain;

use blockchain;

DROP TABLE users;

create table users(
    idx INT NOT NULL auto_increment primary key,
    id VARCHAR(250) NOT NULL,
    pw VARCHAR(250) NOT NULL,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    dcert VARCHAR(250) NOT NULL,
    bnum VARCHAR(250) NOT NULL,
    phone VARCHAR(250) NOT NULL,
    tel VARCHAR(250) NOT NULL,
    cnum VARCHAR(250) NOT NULL,
    anum VARCHAR(250) NOT NULL,
    uname VARCHAR(250) NOT NULL
    );

-- db account for test id - root, pwd - root 
grant all privileges on blockchain.* to root@"%" identified by 'root' with grant option;