# Server

## Deployment

* Download [Heroku toolbelt](https://toolbelt.heroku.com): 

* Login to your Heroku account:
  
  ```
  heroku login
  ```
  
* Create new Heroku app:
  
  ```
  heroku create
  ```
  
  it will create git repo like `https://git.heroku.com/lit-inlet-44494.git`
  
* Copy git repo URL from Heroku and add it to remote:
  
  ``` 
  git remote add heroku https://git.heroku.com/lit-inlet-44494.git
  ```
  
* Deploy to your Heroku app:
  
  ```
  git subtree push --prefix server heroku master
  ```
  
* Set Amazon S3 credentials:

  ```
  heroku config:set AWS_ACCESS_KEY_ID =xxx AWS_SECRET_ACCESS_KEY =yyy
  ```
* Set Amazon S3 bucket in which compressed images will be stored:

  ```
  heroku config:set S3_BUCKET = zzz
  ```
