# Bandwidth Hero Server

This simple proxy server is written in Node.js

It uses Express as a server and Sharp for images compression.

You can run your own instance if you like to.

## Deployment

* Clone Bandwidth Hero repository:

  ```
  git clone https://github.com/ayastreb/bandwidth-hero.git ./bandwidth-hero
  ```
  
* Go to checked out directory:

  ```
  cd bandwidth-hero
  ```

* Download [Heroku toolbelt](https://toolbelt.heroku.com): 

* Login to your Heroku account:
  
  ```
  heroku login
  ```
  
* Create new Heroku app:
  
  ```
  heroku create
  ```
  
* Deploy server sub folder to Heroku app:
  
  ```
  git subtree push --prefix server heroku master
  ```
