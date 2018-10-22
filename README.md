# react-redux-fetcher

**This library was made for my personal project. Not all use cases are tested. I welcome testers, sugestions, pull requests etc.**

Small library for creating API endpoint calls and other fetch calls. Can be used in any project, but is meant to be used with redux to dispatch results to store.

Small, treeshaked lodash dependency.

Original at: [https://github.com/klooperator/redux-rest-fetcher](https://github.com/klooperator/redux-rest-fetcher)

## Install

```
npm install rest-fetcher-redux --save
```
```
yarn add rest-fetcher-redux
```
```
bower install rest-fetcher-redux --save
```

## Description & example

This library is influenced by [redux-api](https://github.com/lexich/redux-api), but instead od using FLUX architecture it will put all its calls under one named reducer.

Once setup you can create your calls like this:

```javascript
    calls = {
         login:{
            url: "http://yoursite.com/api/login",
            method: 'post',
            headers:{
                Accept: 'application/json'
                }
         },
         getUser:{
            url: "http://yoursite.com/api/get-user/:id",
           method: 'get',
           headers:{
                Accept: 'application/json'
                }
        },
    }
```

After that you just make a call like this:

```javascript
    Api.login({body: logindata});
    Api.getUser({id: userID})
```

## Configuration

To configure it properly you should call an instance of it in you app entry point, right before you create a global store instance.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import api from 'redux-rest-fetcher';
import apiCalls from './src/api/calls';

//here you can setup basic configuration that will be valid for all calls.
api.setBaseUrl('http://your-restapi-adress.com');
//you can ommit this, but in case you use other fetch (ex. polyfill) you can set it here
api.setFetch(window.fetch);
//also can be ommited, default is 'api(.)(.)'
//you will see this in redux actions: api(.)(.)callName
api.setPrefix('api@@');
//and of course api calls
api.setEndpoints(apiCalls);
```
At this point redux-rest-fetcher is ready to be passed to your store. Extract reducer from it
```javascript
const apiReducer = api.getReducer()
```
and pass it to your store to be incorporated in your ```combineReducer()```
```javascript
const rootReducer = combineReducer({
	something,
	apiReducer,
	somethingElse
});
```
Once your store is created and populated with ```@@INIT```, pass a dispatcher to api.

```javascript
api.setDispatcher(store.dispatch)
```
Now any time you call you api calls, results will be placed to redux store.

## Creating calls

You create your calls as key value object pairs. Where key will be a name of the function you call and value the call options.
Yo can create multiple files, for ex. each for specific endpoint of your api

```javascript
// /calls/User.js
const enpoint = 'user';
export default {
    login:{
        url: `${endpoint}/login`,
        options: {
            method: 'post',
            headers:{
                accept: 'application/json',
                }
            },
    },
    getGender:{
        url: `${endpoint}/gender/:id`,
        options: {
            headers:{
                Accept: "text/html",
                "Content-Type": "text/html;charset=utf-8",
                }
            },
    }
}
...
// calls/server.js
const enpoint = 'server';
export default {
    refresh:{
        url: `${endpoint}/refresh`,
        options: {
            credentials: 'omit',
            headers:{
                accept: 'application/json',

                }
            },
    },
}
...
// calls/index.js
import User from './User';
import Srv from './Server';
const calls = Object.assign({}, User, Srv);
export default calls;
```

## Overrides and more overrides

There are 3 levels of constructing your request. Base options, options inside your calls and per call options.

Firstly you can set base options. If no other options are set this will be used for each call. In next example we will just implement default options ( this are already in there, if you skip this step, those will be your base options)

```javascript
api.setBaseOptions({
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cache: "no-cache",
        credentials: "same-origin"
      }
    })
```

Then you can override base options with options in call object.In example for ```refresh``` resulting options will be:
```javascript
{
      credentials: "include",
      headers: {
        Accept: "text/html",
        "Content-Type": "text/html;charset=utf-8",
        Cache: "no-cache",
      }
    }
```
In the end you can override request per call by passing second paramater object with desired vaue like this:
```javascript
api.refresh({},{
    headers:{
        Cache: 'force-cache'
        }
    });
//result:
{
      credentials: "include",
      headers: {
        Accept: "text/html",
        "Content-Type": "text/html;charset=utf-8",
        Cache: "force-cache",
      }
    }
```
### Overiding URL

During your basic configuration you can setup base URL that will be attached to every call as prefix.
```javascript
api.setBaseUrl('localhost:3030');
```
Defult base URL is empty string, so all calls will be made on same page.
You can override URL on the flight with absolute ```url``` key. Redux-rest-fetcher will check if ```url``` has ```'http'```, and if yes it will not attach baseUrl prefix to that call.
```javascript
export default = {
	someService:{
		url:'http://someservice.com/api'//this will override baseUrl
	}
}
```
## Features
There are several features included.
#### Body parsing
You can send either stringified JSON or plain object to your call.
```javascript
api.login({body: obj});
//same as
api.login({body: JSON.stringify(obj)});
```
####  GET params
You can past your get params as object with key ```GET```. It will be parsed and the result will be attached to your call URL.
```javascript
api.someService({
    GET:{
        serial: '123456',
        foo: 'bar'
    }
});
// end url result:
'http://someservice.com/api?serial=123456&foo=bar'
```
#### expected
You can set what you expect to as return to prevent fetch errors before they occur.

Default expect is ```json```.
```javascript
api.getText({expected: 'text'})
```
>Of course that means ```body```, ```GET``` and ```expected``` are reserved and do not make keys in url params with those keywords (```url/api/:GET``` or ```uer/api/:body```)
## Using without redux
You can use this library without redux. If you don't pass dispatch function to the library instance you will receive a fetch promise that you need to resolve yourself.

## Lifecyle
On call this method will be called in order:
```
prefetch [array<func>]
-dispatch start
fetch call
-dispatch end
postfetch [array<func>]
```
### Prefetch
Array that accepts and executes functions. Function will receive object with current call:
```
options
params
actions (all registrated calls)
url of the call
dispatch function if one exists
getState function if one exist
helpers (deepMerge)
```
This is called before body is extracted and final url is constructed. It perfect to insert some dynamic data like special headers, keys,etc. or to dispatch some extra action.

### Postfetch
Array that accepts and executes functions. Function will receive object with current call:
```
actions (all registrated calls)
data as raw data received from server
dispatch function if one exists
getState function if one exist
helpers (deepMerge)
```
This is called after data is received and unpacked from server. You can either dispatch some action from here. After this call a promise is returned with data.

###-dispatch start && -dispatch end
A call made before actual fetching has started. A dispatch function will call actionStart that will receive this params:
```
name of the action
url final
options of that call
```
if dispatch or actionStart are not set this will not be called.
Same with dispatch end. A actionEnd must be provided.
actionEnd will receive:
```
name of the call
data
call metadata
```

## Transformers

You can import tranformers from this package:
```
import {transformers, object, array, cumulativeArray} from 'rest-fetch-redux'
```
Transformers transform data before storing it to redux. Default is object and will return ```{}``` on store init. You can change that if you expect array.
cumulativeArray ataches new data to existing array.


