#!/bin/bash
# 단순 기록용, docker-compose로 실행뒤에 컨테이너 들어가서 설정해야함.
# mongosh -u root -p password 
# priority가 크면 우선순위 높음

rs.status();

rs.initiate({
    "_id": "myReplicaSet",
    "members": [
        {
            "_id": 0,
            "host": "mongo1:27017",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "mongo2:27018",
            "priority": 0.5
        },
        {
            "_id": 2,
            "host": "mongo3:27019",
            "priority": 0.5
        }
    ]
});

rs.conf();