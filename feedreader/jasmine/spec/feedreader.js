/// <reference path="../../../../typings/jasmine/jasmine.d.ts"/>

/* @fileoverview feedreader.js: All of the jasmine tests that
 * will be run against app.js
 */

/**
 * We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {


  /** Test the allFeeds variable in app.js */
  describe('RSS Feeds', function () {

    /**
     * Test 01
     * Make sure that the allFeeds variable has been defined and
     * and that it is not empty
     */
    it('are defined and have at least one item.', function () {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });

    /**
     * Loop through each feed in the allFeeds array and test
     * both the url and the name properties.
     * Set up single variables to report tests, we don't want
     * a message for each feed that is looped over.
     */
    var aFeedHasABadUrl = false
      , aFeedHasABadName = false
      , len = allFeeds.length;

    for (var i = 0; i < len; i++) {
      /**
       * Ensure each has a `url` key and its value is not empty
       * Taking care to check the property before the value
       * Test for both conditions and convert them to Booleans
       */
      if ( !(allFeeds[i].url) || !(allFeeds[i].url.length) ) {

        /** Only change to true here (can't be changed back) */
        aFeedHasABadUrl = true;
      }

      /** Same treatment for the `name` keys and values as `url` */
      if ( !(allFeeds[i].name) || !(allFeeds[i].name.length) ) {
        aFeedHasABadName = true;
      }
    }

    /** Test 02 - url is defined and not empty */
    it('each have a `url` string that is not empty', function () {
      expect(aFeedHasABadUrl).toBe(false);
    });

    /** Test 03 - name is defined and not empty */
    it('each have a `name` string that is not empty', function () {
      expect(aFeedHasABadName).toBe(false);
    });

  });


  /* Test The Menu */
  describe('The Menu', function () {

    /**
     * The 'menu-hidden' class hides the menu when added
     * to the body element, and shows it when removed.
     */

    /**
     * TEST 01
     * Ensures the menu element is hidden by default.
     * On DOM loaded the body should have a 'menu-hidden' class
     */
    it('is hidden by default', function () {
      expect(
        /**
         * The actual -
         * Use jQuery to get the element and check if it has
         * the 'menu-hidden' class (.hasClass() returns Boolean)
         */
        $('body').hasClass('menu-hidden')
        ).toBe(true);
    });

    /**
     * Ensure the menu changes visibility when the menu icon is
     * clicked.
     */

    /** TEST 02 - Does the menu display when clicked? */
    it('displays when clicked a first time', function () {

      /**
       * Use jQuery to trigger a click event on the icon, this
       * should add or remove the 'menu-hidden' class on the body.
       */
      $('.menu-icon-link').trigger('click');

      /** Check that the body DOES NOT HAVE the class */
      expect($('body').hasClass('menu-hidden')).toBe(false);

      /** Reset state with a subsequent click */
      $('.menu-icon-link').trigger('click');
    });

    /** TEST 03 - Does the menu hide when clicked a second time? */
    it('hides when clicked a second time', function () {

      /** use jQuery to trigger two click events on the icon */
      $('.menu-icon-link').trigger('click');
      $('.menu-icon-link').trigger('click');

      /** Check that the body HAS the 'menu-hidden' class */
      expect($('body').hasClass('menu-hidden')).toBe(true);
    });

  });


  /* Test the Initialization */
  describe('Initial Entries', function () {

    /**
     * The first content loading is run by init() but we can can't call it
     * directly as we need to be able to send a callback method for
     * testing in Jasmine. Instead we copy the internal code of init()
     * by calling loadFeed() which does allow an optional callback as
     * the second parameter.
     * We use the beforeAll() and pass done as a parameter in the
     * function, to enable Jasmine to handle the asynchronous call.
     */
    beforeAll(function (done) {

      /** load the zeroth index of allFeeds, and run done() when complete */
      loadFeed(0, function () {
        done();
      });
    });

    /**
     * After the asynchronous loadFeed is complete, test for at least
     * a single .entry element within the .feed container.
     * done is passed as parameter to the spec, to tell Jasmine
     * that we are waiting on an asynchronous call. done() is then
     * run again when the spec is finished.
     */
    it('are loaded on first page load', function (done) {

      /** Get the first .entry and convert it to a Boolean (with !!) */
      expect( !!($('.entry')[0]) ).toBe(true);

      /** Tell Jasmine we are finished the async call */
      done();
    });
  });



  /**
   * Test if Feed Switching loads new content.
   *
   * This will first test if the container feed's children mutate.
   * It is not enough to compare content before and after the new
   * feed is selected, because if duplicate feeds exist, the
   * content comparison will pass.
   *
   * Instead this test will intentionally load the same feed twice in a row and
   * check for mutation and same content, then it will load a different
   * feed and just check for content difference.
   */
  describe('New Feed Selection', function () {

    /**
     * We will set up a MutationObserver to watch the .feed container for
     * changes. This will record changes even
     * when the new content is identical to the old content.
     * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
     */

    /** Initialize the test result to false */
    var nodesWereRemoved = false;

    /** select the target node */
    var target = $('.feed')[0];

    /**
     * Configuration of the observer.
     * (attributes, childList and characterData are all required)
     */
    var config = {
      attributes: true,
      childList: true,
      characterData: true
    };

    /** create an observer instance */
    var observer = new MutationObserver(function (mutations) {

      /** on each mutation */
      mutations.forEach(function (mutation) {
        // console.log(mutation); // troubleshoot observer

        /** check if nodes were removed */
        if (mutation.removedNodes.length > 0) {

          /** and $container.empty() ran successfully */
          nodesWereRemoved = true;
        }
      });
    });


    /**
     * We will be grabbing content after each selection has loaded
     * and later comparing them for equality. Set up the variables
     * now to have them available during all procedures in the test.
     */
    var contentAfterFirstLoad
      , contentAfterSecondLoad
      , contentAfterThirdLoad;

    /**
     * We run the asynchronous calls prior to testing the specs again by
     * passing Jasmine's purpose built 'done' function with beforeAll.
     * We test this by loading the same feed twice.
     * If the content is the same, but the jQuery objects are not strictly
     * equal, then we know the second load successfully changed the DOM
     */
    beforeAll(function (done) {

      /**
       * Start observing the container for mutations
       * pass in the target node, as well as the observer options
       */
      observer.observe(target, config);

      /** Load the second feed from allFeeds array */
      loadFeed(1, function () {

        /** and save the content to the 'first' variable */
        contentAfterFirstLoad = $('.feed').html();

        /** Now load the second feed from allFeeds again */
        loadFeed(1, function () {

          /** and save its content to the 'second' variable */
          contentAfterSecondLoad = $('.feed').html();

          /**
           * We can disconnect the observer now because we only need
           * to know that the content changes for the third selection
           */
          observer.disconnect();

          /** Now load the first feed from allFeeds */
          loadFeed(0, function () {

            /** and save its content to the 'third' variable */
            contentAfterThirdLoad = $('.feed').html();

            /** Tell Jasmine we are finished with beforeAll async calls */
            done();
          });

        });
      });
    });

    /* Make the content comparisons and check mutation occurred */
    it('changes the page content', function (done) {

      // console.log(
      //   'first:', contentAfterFirstLoad,
      //   'second:', contentAfterSecondLoad,
      //   'third:', contentAfterThirdLoad
      // );

      expect(contentAfterFirstLoad).toBe(contentAfterSecondLoad);
      expect(nodesWereRemoved).toBe(true);
      expect(contentAfterSecondLoad).not.toBe(contentAfterThirdLoad);

      /** and tell Jasmin that this async is finished */
      done();
    });

  });

  /**
   *
   * Udacious extras
   *
   */

  /** Test additional feeds */
  describe('[extra] Additional feeds', function () {

    /** an example feed object */
    var newFeed = {
      'name': 'XKCD',
      'url': 'http://xkcd.com/rss.xml'
    };

    /** add a new feed */
    beforeEach(function () {
      addNewFeed(newFeed);
    });
    
    /** reload the initial zeroth feed */
    afterAll(function () {
      loadFeed(0);
    });

    /** gets added to the allFeeds array */
    it('are added successfully', function () {

      /** check the new feed (and reset state for next test) */
      expect(allFeeds.pop()).toBe(newFeed);
    });

    /** is rendered on the page with loadFeed */
    it('display successfully', function () {

      /** load the new feed */
      loadFeed(4);

      /** if .entry is found then the feed was built successfully */
      expect( !!$('.entry') ).toBe(true);

      /** reset initial app state of allFeeds */
      allFeeds.pop();
    });

  });

} (jQuery));