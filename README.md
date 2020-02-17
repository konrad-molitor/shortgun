[![first-timers-only](https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](https://www.firsttimersonly.com/)

# Shortgun - URL shortener service
Shortgun provides REST API for URL shortener service building. It includes account creation, authorization, CRUD operations for URL shortcuts and additional features such as saving messages from users.

![Shortgun Logo](https://images2.imgbox.com/25/dd/NE6zPr7x_o.png)

> This project built for learning purposes. 
__Do not use it for business-critical or other essential tasks.__

## Requirements
* Latest LTS or current installation of __Node.js__ (tested on 13.8.0)
* __MongoDB__ server up and running
* __Nginx__ or another web-server up and running for serving page preview thumbnails and proxy requests
* __Git__ installed

## Installation
1. Clone this repository to local machine

```git clone https://github.com/konrad-molitor/shortgun.git```

2. Navigate to `shortgun` directory

```cd shortgun```

3. Perform dependecies installation

```npm install```

4. Build project

```npm run build```

5. Navigate to `build` directory

```cd build```

6. Create `.env` file.

    `.env` file shoult contain following information: 

    * MongoDB connection string (https://docs.mongodb.com/manual/reference/connection-string/)

    ```DB_URL=<mongodb_connection_string>```

    * JsonWebToken secret key string

    ```SECRET_KEY=<jwt_secret_key>```

    * Thumbnails directory path (make sure that user running this app has write permission to it)

    ```THUMBNAILS_PATH=<thumbnails directory full path>```

7. Configure your web server to host thumnails directory to `/images` path
8. Configure your web server to proxy requests all requests to `/a` to desired port/URL
9. Set your `process.env.PORT` variable to desired port (this also can be done using `.env` file)
9. Run `build/app.js`

```node app.js```

> I suggest using process management software such as _pm2_, _IBM StrongLoop_, _Forever_ or _systemd_

## API

### Routes list
API provides following routes:
```
/a/
 signup
 login
 profile
 item/<itemId>
 message
 add
/s/
 <shortcut>
```

### `/a/signup`

Route for creating a new user account

Parameters:

HTTP Verb:
* `POST`

Headers: 
* `Content-Type` __required__ - must be `application/json`

Request body: 
* `email` __required__ __`String`__ - new user email
* `password` __required__ __`String`__ - new user password

Returns:

HTTP Status:
* `409` - if user already exists (no data saved in DB)
* `500` - Server error
* `200` - New account created

Response body: 
* `User already exists` - if user already exists
* `Error` - if server error occured
* `<email>` - created user email

### `/a/login`

Login route

Parameters: 

HTTP Verb:
* `POST`

Headers:

* `Content-Type` __required__ must be `application/json`

Request body: 

* `email` __required__ __`String`__ - user email
* `password` __required__ __`String`__ - user password

Returns:

HTTP Status: 
* `403` - Authentication failed
* `500` - Server error
* `200` - Login successful

Response body: 
* `No such user.` - provided email does not exist in database
* `Invalid password.` - provided password does not match stored in database for provided email
* `Server error` - server error occured during processing the request
* `<token>` - JWT token

### `/a/profile`

Profile data route

Parameters:

HTTP Verb: 
* `GET`

Headers:
* `X-Auth` __required__ - must contain user token in format
    ```Bearer:<space><usertoken>```
    as this:
    ```Bearer: thisIsUser.Token```

Returns: 

HTTP Status: 

* `400` - Incorrect request headers 
* `401` - Incorrect or missing token
* `500` - Server error
* `200` - OK

Response body:

* `Server error` - server error occured during processing the request
* `Invalid token.` - Token was processed, but no according records were found in database
* `Incorrect request headers.` - Token can not be processed
* `Authorization required` - No `X-Auth` header present in request
* `[Object]` __JSON__ user object in following format: 
```
{
    _id: <userId>,
    email: <userEmail>,
    urls: [
        {
            longUrl: <longUrl>, //long URL string
            shortUrl: <shortUrl>, //shortcut string
            _id: <shortcutId>,
            preview: <previewImage>, //only filename
            pageTitle: <pageTitle> //original page title
        }
    ]
}
```

### `/a/item/<itemId>`

Shortcut item managing route

Example:
    ```/a/item/5e3ec5f2a986c875e30d088f```

Parameters:

HTTP Verb:
* `DELETE`

Headers: 
* `X-Auth` __required__ - must contain user token in format
    ```Bearer:<space><usertoken>```
    as this:
    ```Bearer: thisIsUser.Token```

URL parameters: 
* `<itemId>` __required__ - shortcut item id.
    

Returns:

HTTP Status:

* `400` - Incorrect request headers or invalid item ID
* `401` - Incorrect or missing token, attempt to delete another user shortcut
* `404` - Shortcut ID not found
* `500` - Server error
* `200` - OK

Response body: 
* `Server error` - server error occured during processing the request
* `Only shortcut author can delete it.` - attempt to delete another user shortcut
* `No such shortcut.` - shortcut with such ID not found
* `Authorization required` - Token invalid or missing
* `Invalid item ID` - provided item ID is invalid
* `[Object]` - Deleted item in following format:

    ```
    {
        longUrl: <longUrl>, //long URL string
        shortUrl: <shortUrl>, //shortcut string
        _id: <shortcutId>,
        preview: <previewImage>, //only filename
        pageTitle: <pageTitle> //original page title
    }
    ```

### `/a/message`

Route for direct messaging server owner

Parameters:

HTTP Verb:
* `POST`

Headers:
* `Content-Type` __required__ must be `application/json`
* `X-Auth` - _may_ contain user token in format
    ```Bearer:<space><usertoken>```
    as this:
    ```Bearer: thisIsUser.Token```

Request body: 
* `email` __required__ __`String`__ sender email
* `message` __required__ __`String`__ message body

Returns:

HTTP Status: 
* `204` - Message successfully created
* `500` - Server error

### `/a/add`

Route for adding shortcuts

Parameters

HTTP Verb: 
* `POST`

Headers:
* `Content-Type` __required__ must be `application/json`
* `X-Auth` __required__ - must contain user token in format
    ```Bearer:<space><usertoken>```
    as this:
    ```Bearer: thisIsUser.Token```

Request body:
* `longUrl` __required__ __`String`__ - desired URL for creating shortcut

Returns:

HTTP Status:
* `401` - Authentication failed
* `500` - Server error
* `200` - OK

Response body:
* `[Object]` - created item in following format:

    ```
    {
        longUrl: <longUrl>, //long URL string
        shortUrl: <shortUrl>, //shortcut string
        _id: <shortcutId>,
        preview: <previewImage>, //only filename
        pageTitle: <pageTitle> //original page title
    }
    ```

### `/s/<shortUrl>`

Redirect to original URL path

Parameters:

HTTP Verb: 
* `GET`

Returns:

HTTP Status:
* `302` - Found

Headers:
* `Location` - original URL location. 

    >Will redirect to __`/`__ if shortcut not found

### Content format

Essentially, shortgun operates only few content unit types: `User`, `Shortcut` and `Message`.

#### User

User profile record

Fields: 
* `email` __required__ __unique__ __`String`__ - user email. For authentication purposes only (for now)
* `password` __required__ __`String`__ - user password. Stored as hash with help of `bcrypt` library.
* `urls` __`[ObjectID]`__ - an array containing user created shortcuts IDs

#### Shortcut

Shortcut item record

Fields:

* `longUrl` __required__ __`String`__ - original URL
* `shortUrl` __unique__ __`String`__ - shortcut string (without actual URL, it's up to client to form full link URL)
* `author` __required__ __`ObjectID`__ - shortcut author record ID
* `preview` __`String`__ - preview image filename (without path)
* `pageTitle` __`String`__ - page title of original URL

#### Message

Messages to site owner format

Fields:
* `email` __required__ __`String`__ - sender email
* `message` __required__ __`String`__ - message body
* `user` __`String`__ - not implemented yet

### Preview images

Previews are generated during shortcut creation. Hovewer, preview generation takes some time, so _initially server will send shortcut item without `preview` and `pageTitle` fields_. They will appear later, as preview generation process will finish.

Previews are stored in JPEG format with filename format `<shortcutId>.jpg`. Original page screenshots are taken with viewport size 1280x720 px and then resized to 400x225 px.

## Contributing
PRs are welcome. For major changes, please open an issue first to discuss what you would like to change.
https://www.firsttimersonly.com/ - friendly.


## License

Unless stated elsewhere, file headers or otherwise, the license as stated in the LICENSE file.