# jspdf large file test

This shows what happens when generating a PDF of a custom size from a large image. Try it out by running `yarn start` and opening up the page and clicking "make pdf".

In v1.5.3 it truncates the image to "71 rows".

If you run `yarn add jspdf@1.4.1` to go to an older version and run it again, you'll see that it generates a full "99 rows" in the resulting PDF.
