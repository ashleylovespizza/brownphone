# Brownphone

## Install Locally 

**Clone**	
`git clone git@github.com:ideo/brownphone.git`	
`cd` into app

**Environment**		
Setup a `.env` file. Copy over all variables from `.env.example` and run `php artisan key:generate`. Set the and the postgres `DATABASE_URL`.

**Composer**	
Make sure that you have [Composer](https://getcomposer.org/) installed 
 
**Install Dependencies**	
`composer install`

**Node**		
`npm install`	

**Gulp**	
`gulp watch`

**Start Server**	
`php artisan serve`

**Database Postgres**		
Run the postgres database. [http://postgresapp.com/](http://postgresapp.com/) Launch the the command line and create the database. 
``CREATE DATABASE brownphone;``

**Migrate the Database**		
``php artisan migrate``

## Assets
The recordings are stored on a S3 server. For now this is hardcoded in the VR app, but will need to be removed later.


## Deloy to Heroku 
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ideo/ff_understandings)

*Reset the heroku database*
``heroku pg:reset DATABASE``

## Tips 
If `art serve` mysteriously stops working, clear Laravel's cache by running `composer dump-autoload`
