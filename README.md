# backend-nodejs

[Link to API documentation generated using Postman][1]

# how to start (2 methods)
**method 1**

*prerequisites: Node.js(version 10.x or higher recommended) installed*

Steps to run:
1. Navigate to the root of the project
2. Run "npm install"
3. Run "npm start"

**method 2**

*prerequisites: Docker installed*

Steps to run:
1. Navigate to the root of the project
2. Run "docker-compose build"
3. Run "docker-compose up"

Node.js server will start on https://localhost:3000

# Core Features

**Scheduling**

To achieve scheduling of transactions, [Git Library for managing jobs][2]

List of scheduled jobs (prerequisite transactions in state - 'New' (not accumulated yet))
Ordered from highest to lowest prio jobs, can be scheduled every 15 minutes or so

Job1 - Transactions from users with prio [0-5] and same account/nationality (e.g LT-LT)
Job2 - Transactions from users with prio [0-5] and different account/nationality
Job3 - Transactions from users with prio [6-10] and same account/nationality (e.g LT-LT)
Job4 - Transactions from users with prio [6-10] and different account/nationality



[1]: https://documenter.getpostman.com/view/2783029/SztBa7ga?version=latest "API Documentation"
[2]: https://github.com/agenda/agenda "Git Library for managing jobs"

