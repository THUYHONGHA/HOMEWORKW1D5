var express = require('express');
var fetch = require('node-fetch');
var Rx = require('rxjs/Rx');
var router = express.Router();

const url = 'http://jsonplaceholder.typicode.com/users/';

let fetchObservable = () => {
    return new Rx.Observable(observer => {
        fetch(url)
            .then((res) => res.json())
            .then((users) => {
                observer.next(users);
                observer.complete();
            })
            .catch((error) => observer.error('Fetch data error'));
    });
};

let fetchAsyncAwait = async (req, res) => {
    try {
        let r = await fetch(url, {method: 'get'});
        let users = await r.json();
        console.log('users: ', users);
        res.render('users', { users: users, title: 'WELCOME TO MY PAGE' });
    } catch (ex) {
        console.error('Error-catch----'+ex)
         res.render('error',{messasge: ex})
    }
};
      


/* GET users listing. */
router.get('/', function(req, res, next) {
  //promise
 fetch(url).then((data) => data.json())
      .then(users => res.render('users',{users: users, title: 'WELCOME TO MY PAGE'}))
      .catch(error => res.render('error',{messasge: error}));

//Observable
// async function asyncData(url){
//   fetch(url).then(data => data.json()).then(data =>dataGen.next(data))
// } 
});


router.get('/obs', (req, res, next) => {
    fetchObservable().subscribe(users => res.render('users', { users: users, title: 'WELCOME TO MY PAGE' }),
    error => res.render('error', { message: 'Failed to fetch data', error: error }));
});


router.get('/async', (req, res, next) => {
   console.log('before :----');
    fetchAsyncAwait(req, res);
    
});

module.exports = router;
