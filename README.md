Image Search Abstraction Layer
==========================

> User stories:
> - I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
> - I can paginate through the responses by adding a ?offset=2 parameter to the URL.
> - I can get a list of the most recently submitted search strings.

Search for "cat" images at page 5:
--------------
`https://clean-latex.glitch.me/search/cat?offset=5`

Output:

[
  {
	  "url": "https://www.bluecross.org.uk/sites/default/files/assets/images/124044lpr.jpg",
	  "snippet": "Cat and kitten flea treatment advice | How to get rid of cat fleas ...",
	  "page": "https://www.bluecross.org.uk/pet-advice/cat-and-kitten-flea-treatment-advice"
  }, { ...}, ...
]

List of most recent search strings:
-------------
`https://clean-latex.glitch.me/recent`

Output:

[{"searchString":"cat","when":"2017-12-11T04:17:17.911Z"},{...}, ...]

-------------------

\ ゜o゜)ノ