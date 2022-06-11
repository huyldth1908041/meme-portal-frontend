const express = require('express');
const path = require('path');
const fs = require("fs");
const app = express();
const axios = require('axios')
const PORT = process.env.PORT || 3000;
const indexPath  = path.resolve(__dirname, '..', 'build', 'index.html');

// static resources should just be served as they are
app.use(express.static(
  path.resolve(__dirname, '..', 'build'),
  { maxAge: '30d' },
));
// here we serve the index.html page
app.get('/*', (req, res, next) => {
  fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    // get post info
   try {
     if(!req.path.includes('/post/')) {
       return res.send(htmlData);
     }
     const postId = req.path.split('/post/')[1];
     console.log(postId);
     const postDetail = await axios.get(`https://memeportalapi.xyz/api/v1/posts/${postId}`);
     const post = postDetail.data.data;
     if(!post) {
       throw new Error('Post not found');
     }
     // inject meta tags
     htmlData = htmlData.replace(
       "<title>Hài Code</title>",
       `<title>${post.title}</title>`
     )
       .replace('__META_OG_TITLE__', post.title)
       .replace('__META_OG_DESCRIPTION__', post.description || 'Hài code meme cho lập trình viên')
       .replace('__META_DESCRIPTION__', post.description || 'Hài code meme cho lập trình viên')
       .replace('__META_OG_IMAGE__', post.image)
   }catch (err) {
      console.log(err);
   } finally {
      res.send(htmlData);
   }
  });
});
// listening...
app.listen(PORT, (error) => {
  if (error) {
    return console.log('Error during app startup', error);
  }
  console.log("listening on " + PORT + "...");
});