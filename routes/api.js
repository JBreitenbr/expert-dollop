/*

*

*

*       Complete the API routing below

*       

*       

*/

'use strict';

let mongoose=require("mongoose");

let bookSchema = new mongoose.Schema({

    title: {

      type: String,

      required: true

    },

    comments: [String]

});

let Book=mongoose.model("Book",bookSchema);

module.exports = function (app) {

  app.route('/api/books')

    .get(function (req, res){

      //response will be array of book objects

      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

            Book.find({}, (err, library) => {

        if(err){res.send('there was an error')}

        else if (!library) {

          res.json([]);

        } else {

          const libData = library.map((book) => {

            return {

              _id: book._id,

              title: book.title,

              comments: book.comments,

              commentcount: book.comments.length,

            };

          });

          res.json(libData);

        }

      });

    })

    

    .post(function (req, res){

      let title = req.body.title;

      //response will contain new book object including atleast _id and title

      if (!title) {

        res.send('missing required field title');

        return;

      }

      const newBook = new Book({ title, comments: [] });

      newBook.save((err, book) => {

        if (err || !book) {

          res.send('there was an error');

        } else {

          res.json({ _id: book._id, title: book.title });

        }

      })

    })

    

    .delete(function(req, res){

      //if successful response will be 'complete delete successful'

      Book.remove({}, (err, library) => {

        if (err || !library) {

          res.send('there was an error');

        } else {

          res.send('complete delete successful');

        }

      });

    });

  app.route('/api/books/:_id')

    .get(function (req, res){

      let bookid = req.params._id;

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid, (err, book) => {

        if (!book) {

          res.send('no book exists');

        } else {

          res.json({

            comments: book.comments,

            _id: book._id,

            title: book.title,

            commentcount: book.comments.length,

          });

        }

      });

    })

    

    .post(function(req, res){

      let bookid = req.params._id;

      let comment = req.body.comment;

      if (!comment) {

        res.send('missing required field comment');

        return;

      }

      //json res format same as .get

      Book.findById(bookid, (err, bookdata) => {

        if (!bookdata) {

          res.send('no book exists');

        } else {

          bookdata.comments.push(comment);

          bookdata.save((err, savedBook) => {

            res.json({

              comments: savedBook.comments,

              _id: savedBook._id,

              title: savedBook.title,

              commentcount: savedBook.comments.length,

            });

          });

        }

      });

    })

  

    

    .delete(function(req, res){

      let bookid = req.params._id;

      //if successful response will be 'delete successful'

      //if successful response will be 'delete successful'

      Book.findByIdAndRemove(bookid, (err, book) => {

        if (err || !book) {

          res.send('no book exists');

        } else {

          res.send('delete successful');

        }

      });

    });

  

};

