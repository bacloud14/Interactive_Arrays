# Interactive_Arrays

### Purpose: 

A JavaScript application to experiment JavaScript libraries. It is intuitive for users and tiny for follow collaborating developers. Users can test and learn using browser developer tools.

There are plenty of posts that ask how to load Jquery, Underscore, Lodash... via console? Most offer the following handy snippet:


```
   var s = document.createElement('script'); 

   s.type = 'text/javascript';

   s.src = 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js';

   document.head.appendChild(s);
 ```


I just copied the snippet and made it easier to load a couple of libraries in the same session.

Another handy way is to tell the library's name, the targeted version via URL in https://cdnjs.cloudflare.com/ , its initial variable (`_`, `jQuery` ...) and its path of version if known, because JavaScript libraries are implemented very differently, there is much debugging to make it more intelligent and stable.

### Glimpse of UI

![Screenshot](../master/Capture.png)


### Todo (check open issues):

   1- Test and improve
   
   2- Add features to enrich interaction from the console with the HTML page (beautify and display console.dir for example)

On Glitch: 

https://glitch.com/~interactive-arrays

## Docker Image

This docker image simply serves the sites static content on port 80.

### Build

To build the image simply run `docker build -t IMAGE_NAME .`.

### Run

To start serving the website, run `docker run -d -p 8080:80 IMAGE_NAME .`. Now you can go to http://localhost:8080 and access Interactive Arrays!
