# Feedreader Overview

This is a basic web-based application that reads RSS feeds. It is being developed using Behavior Driven Development (BDD) in JavaScript with Jasmine http://jasmine.github.io/

## Package Contents
**working Files**
 - `index.html` - The application's single page
 - `js/app.js` - The application code
 - `jasmine/spec/feedreader.js` - The Jasmine test suite
 - `css/style.css` - The main stylesheet for the application

**support files**
 - `jasmine/lib/` - The Jasmine application
 - `css/normalize.css` - Normalizing stylesheet from git.io/normalize
 - `css/icomoon.css` - icon font

## Demo

You can view a live version of the application right here
http://georgeplaten.github.io/fe-p6/feedreader/


## To download and run or edit locally

Grab the code as a zip file
https://github.com/GeorgePlaten/fe-p6/archive/master.zip

Or clone the repository with git
https://github.com/GeorgePlaten/fe-p6.git

To run the application locally, extract the files to a suitable location (if you downloaded the zip file), open `index.html` in a web browser by dragging and dropping it in, or using the keyboard shortcut `Ctrl+O` and browsing to its location.

## History and Future
This application is part project submission for the Udacity Frontend Nanodegree and most of the application's functionality was provided. The project was to develop the Jasmine test suite.

This project has no future, any and all visitors are welcome to do with it as they please.

# Udacious Extras
## Additional Feeds
A function `addNewFeed` was added to `app.js` to enable the adding of further feeds. `addNewFeed` takes a single parameter containing an object describing a new RSS feed in the format: `{'name': 'string', 'url': 'string'}`.

Two tests were added to the test suite:  
1. To make sure new object is added to the list of feeds  
2. To make sure the new object is rendered to the page when it is called with loadFeed