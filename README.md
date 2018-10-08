# Share Harder

This allows you to test multiple variants of title, description and image of the share preview on Facebook. It uses a [bandit algorithm](https://en.wikipedia.org/wiki/Thompson_sampling) to find the best variant much more quickly than conventional A/B testing.

You add overlay text to the image, and personalise the title, description and image text with merge tags.

You can also create personalized image generators (for memes, email embeds, customised share graphics and more).

Inspired by [ShareBandit](https://github.com/MoveOnOrg/sharebandit)

![screenshot of the experiment editor](./docs/experiment_editor.png "WYSIWYG editor")
![screenshot of the experiment editor](./docs/exp2.png "WYSIWYG editor")

# Try it out - deploy a working version of the app to Heroku now

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Required ENV variables:
 - APP_URL - this needs to be set to https://your-app-name.herokuapp.com (no trailing slash)
 - GOOGLE_FONTS_API_KEY - this needs to be set to use text overlays on share images

## Dev Setup

The app uses Ruby on Rails with React / Redux for the front end (in order to achieve as many 'R's as possible).

Dependencies:
 - Ruby
 - Postgres
 - Redis
 - Node
 - Yarn (Node package management)

Once you have these setup you can run the following to set the app up locally.

```
git clone https://github.com/jamesr2323/facebook_share_tester.git
cd facebook_share_tester
bundle install
createdb facebook_share_tester_dev
```

Add the connection string for the local database to a .env file in the app root directory. `DATABASE_URL=.....`

```
foreman run rake db:schema:load
foreman start -f Procfile.dev
```

## ENV variables
 - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET - Used for OAuth login, get it from the Google Cloud console
 - GOOGLE_FONTS_API_KEY - You'll need this if you want to use the text overlays on images. Instructions on getting a free key here: https://developers.google.com/fonts/docs/developer_api

## Javascript API

Share Harder is most powerful when embedded in other sites. To make this easy there's a javascript embed exposing a simple API that allows you to integrate more easily.

Include https://your-share-harder-instance.server.com/script/script.js somewhere in your page. This will expose Share Harder API methods through a global `ShareHarder` object.

`ShareHarder.getVariant({callback: function(rendered_variant) (default to null), url: String (default to current URL)})`

This requests a variant for the experiment matching the given URL (or the current URL if none is supplied). When the variant is returned it is rendered using any personalisation data that has been set and then the callback function is called with the rendered variant:

```
{
  title: String,
  description: String,
  rendered_image_url: String,
  share_url: String (This is the URL that the user should be redirected to to initiate the share)
}
```

`ShareHarder.updatePersonalisation(personalisation Object)`

This takes an Object with values for personalisation tags, e.g. `{name: 'James', city: 'London'}`. If a callback function has already been registered (see `getVariant`), then the share will be rendered with the new personalisation data and the callback function invoked.

`ShareHarder.recordGoal()`

This is used to tell Share Harder that the goal for the page has been reached by the user (e.g. signing a petition). You do not need to identify the user as the information required is appended to the query string parameters when Share Harder redirects the user.

`ShareHarder.getData()`

Returns the rendered share variant data that is normally passed to the callback function.

## User documentation

User documentation is inline, accessed by clicking the "Help" button on the right of the screen. Docs are loaded from the `/docs` directory within the template folder for the current view. E.g. Docs for `/experiments` would be loaded from `/app/views/experiments/docs/_index.html.erb`.

## Tests

Create a database and add it to a new `.env.test` file `DATABASE_URL=...`

```
RAILS_ENV=test rake db:schema:load
RAILS_ENV=test rspec
```

## Example using Javascript API (requires jQuery)

This example works with the Speakout app for campaigns. It demonstrates using the API to select a variant using the bandit algorithm, filling in personalisation of the share using user-supplied info, and registering a successful goal.

```
$.getScript('https://your-share-harder-instance.your-org.com/scripts/script.js', function(){
  $(document).ready(function(){
    /* Get the variant from Share Harder and register the callback */
    ShareHarder.getVariant({
      url: 'https://speakout.your-org.com/campaigns/' + window.Campaign.id,
      callback: function(data){
        $('.facebook-share-preview--title').html(data.title)
        $('.facebook-share-preview-image img').attr('src', data.image_url)
        $('.facebook-share-preview-description').html(data.description)

        $('.js-share-clicked.facebook').unbind('click')
        $('.js-share-clicked.facebook').click(function(ev){
          ev.preventDefault() // Stop form submit
          $('input[name="rshare[medium]"]').val('facebook')
          $('input[name="rshare[tracking_code]"]').val(data.key)

          // Send the data to the server
          $.post($('.js-share-form').attr('action'), $('.js-share-form').serialize())

          // Open Facebook share dialog in new window
          var win = window.open(ShareHarder.getData().share_url, '_blank');
          if (win) {
            win.focus();
          }
        })
      }
    })

    /* When the user clicks sign, record success and update the share preview on the next stage */
    $('.js-sign').click(function(){
      var name = $('#rsign_name').val().split(' ')[0]
      if (name.length == 0){
        name = $('.known-member-you strong:eq(0)').text().split(' ')[0]
      }
      if ($('#rsign_comment').length > 0) {
        var comment = $('#rsign_comment').val()
      } else {
        var comment = ''
      }
      var sigs = $('.signature-counter').text()
      ShareHarder.updatePersonalisation({name: name, sigs: sigs, comment: comment})
      ShareHarder.recordGoal()
    })
  })
})
```
