const express = require('express');
const bodyParser = require('body-parser');
const OK = 200;
const NO_CONTENT = 204;
const CREATED = 201;
const SEE_OTHER = 303;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
function serve(port, model) {
          const app = express();
          app.locals.model = model;
          app.locals.port = port;
          setupRoutes(app);
          app.listen(port, function() {
                      console.log(`listening on port ${port}`);
                    });
}
function setupRoutes(app) {
        app.use('/users/:id', bodyParser.json());
        app.get('/users/:id', getUser(app));
        app.delete('/users/:id', deleteUser(app));
        app.post('/users/:id', updateUser(app));
        app.put('/users/:id', newUser(app));
}
function requestUrl(req) {
          const port = req.app.locals.port;
          return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
module.exports = {
          serve: serve
}
function getUser(app)
{
        return function(request,response){
                const id= request.params;
                if(typeof id === 'undefined'){
                        response.sendStatus(BAD_REQUEST);
                }
                else{
                        request.app.locals.model.users.getUser(id).
                                then((results) => response.json(results)).
                                catch((err) => {
                                        console.error(err);
                                                response.sendStatus(NOT_FOUND);
                                });
                }
        };
}

function deleteUser(app) {
        return function(request, response) {
                const id = request.params;
                if(typeof id === 'undefined') {
                        response.sendStatus(BAD_REQUEST);
                }
                else {
                        request.app.locals.model.users.find(request.params).
                        then(function(result) {
                        if(result.length === 1) {
                                                        request.app.locals.model.users.deleteUser(id).
                                                        then(() => response.end()).
                                                        catch((err) => {
                                                                            console.error(err);
                                                                       });
                                                }
                        else{
                                response.sendStatus(NOT_FOUND);
                        }
                }).
                        catch((err) => {
                                console.error(err);
                        });
                }
        };
}
function updateUser(app) {
        return function(request, response) {
                const temp = {id: request.params.id, data:request.body};
                const id = request.params;
                if(typeof id === 'undefined') {
                        response.sendStatus(BAD_REQUEST);
                }
                else {
                        request.app.locals.model.users.find(request.params).
                        then(function(result) {
                        if(result.length === 1) {
                                                request.app.locals.model.users.updateUser(id, temp).
                                                then(function(id) {
                                                response.append('Location', requestUrl(request) + '/' + id);
                                                response.sendStatus(SEE_OTHER);
                                                }).
                                                catch((err) => {
                                                        console.error(err);
                                                        response.sendStatus(SERVER_ERROR);
                                                });
                        }
                        else {
                                response.sendStatus(NOT_FOUND);
                        }
                        }).
                        catch((err) => {
                                console.error(err);
                        });
        }
        };
}

function newUser(app) {
        return function(request, response) {
        const temp = {id:request.params.id, data:request.body};
        const id = request.params;
        if(typeof id === 'undefined') {
                response.sendStatus(BAD_REQUEST);
        }
        else {
        request.app.locals.model.users.find(request.params).
        then(function(result) {
                if(result.length === 1) {
                        request.app.locals.model.users.updateUser(request.params, temp).
                        then(function(id) {
                                response.append('Location', requestUrl(request) + '/' + id);
                                response.sendStatus(NO_CONTENT);
                        }).
                        catch((err) => {
                               console.error(err);
                               response.sendStatus(SERVER_ERROR);
                        });
                }else {
                request.app.locals.model.users.newUser(temp).
                then(function(id) {
                        response.append('Location', requestUrl(request) + '/' + id);
                        response.sendStatus(CREATED);
                }).
                catch((err)=>{
                       console.error(err);
                       response.sendStatus(SERVER_ERROR);
                });
                }
        }).
        catch((err) => {
                console.error(err);
                response.sendStatus(SERVER_ERROR);
                });
        }
        };
}
