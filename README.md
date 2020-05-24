# backend-nodejs

# user transactions by query are formed using following library:
  https://github.com/Turistforeningen/node-mongo-querystring#readme

E.g use-case: I want to get my May transactions, where transfer amount of single transaction is equal or greater than 200;

Preferred way:
Endpoint: /transactions?transfer_amount=>200&created_between=2020-05-01|2020-06-01

Alternative way:
Endpoint: /transactions?transfer_amount=>200&created=>2020-05-01&created=<2020-06-01

