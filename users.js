const assert = require('assert');
const USERS = 'users';
function Users(db) {
          this.db = db;
          this.users = db.collection(USERS);
}
Users.prototype.find = function(query) {
          return this.users.find(query).toArray();
}
Users.prototype.getUser = function(id) {
          return this.users.find(id).toArray().
                    then(function(users) {
                          return new Promise(function(resolve, reject) {
                              if (users.length === 1) {
                                    resolve(users[0]);
                                   }
                              else {
                                    reject(new Error(`cannot find user ${id}`));
                                  }
                                });
                                });
}
Users.prototype.deleteUser = function(id) {
        return this.users.deleteOne(id).
        then(function(results) {
                return new Promise(function(resolve, reject) {
                        if(results.deletedCount === 1 ) {
                                resolve();
                        }
                        else {
                        reject(new Error('cannot delete user ${id}'));
                        }
                });
        });
}
Users.prototype.updateUser = function(id, temp) {
        return this.users.updateOne(id, temp).
        then(function(result) {
                return new Promise(function(resolve, reject) {
                        if(result.modifiedCount != 1) {
                                reject(new Error('updated ${result.modifiedCount} users'));
                        }
                        else {
                                resolve();
                        }
                });
        });
}
Users.prototype.newUser = function(temp) {
        return this.users.insertOne(temp).
        then(function(results) {
                return new Promise((resolve) => resolve(results.insertedId));
        });
}
module.exports = {
        Users: Users,
};
