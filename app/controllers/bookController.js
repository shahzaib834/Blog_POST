//const Book = require('../models/Book');
//const User = require('../models/User');
//const Like = require('../models/Like');
//const Comment = require('../models/Comment');

const showAllBooks = async (req, res) => {
  const books = await Book.findAll({
    where: {
      status: 'Active',
    },
  });
  res.send(books);
};

const showBookWithId = async (req, res) => {
  const id = req.params.id;

  const book = await Book.findAll({
    where: {
      id,
      status: 'Active',
    },
  });

  if (!book) {
    return res.status(400).send('No Book found');
  }

  res.status(200).send(book);
};

const addBook = async (req, res) => {
  try {
    const { author, title, description, category, price } = req.body;

    if (!author || !title || !description || !category || !price) {
      res
        .status(400)
        .send('Title, Description, Category, Author and Price are required');
    }

    const user = await User.findByPk(req.user.email);

    if (user) {
      const book = await Book.create({
        author,
        title,
        description,
        category,
        addedBy: user.email,
        price,
      });

      res.status(200).json({
        message: `Book created Succesfully`,
        book,
      });
    } else {
      res.status(404).send(`User not found`);
    }
  } catch (err) {
    console.log(`Error : ${err.message}`);
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookToDelete = await Book.findByPk(req.params.id);

    if (!bookToDelete) {
      return res.status(400).send('Book not found');
    }

    const user = await User.findByPk(req.user.email);

    // Checking if requested person owns the book.
    const isOwner = await Book.findAll({
      where: {
        addedBy: user.email,
        id: bookToDelete.id,
      },
    });

    if (!isOwner.length) {
      return res.status(400).send(`You cannot delete this book. No Permission`);
    }

    // Delete Book From Books Model
    const deletedBook = await Book.update(
      // Not Working...
      { status: 'Disabled' },
      {
        where: {
          id: bookToDelete.id,
        },
      }
    );

    res.status(200).json({
      message: 'Deleted Succesfully',
      deletedBook,
    });
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
};

const likeABook = async (req, res) => {
  try {
    // Finding book comming with params.
    const bookToLike = await Book.findByPk(req.params.id);

    // Checking if user send a valid book id
    if (!bookToLike) {
      res.status(400).send(`Error: No Book found`);
    }

    // getting user id
    const user = await User.findByPk(req.user.email);

    //Checking if the user already liked the book
    const alreadyLiked = await Like.findAll({
      where: {
        userEmail: user.email,
        bookId: bookToLike.id,
      },
    });

    if (alreadyLiked.length) {
      res.status(400).send(`You already liked the book.`);
    } else {
      // Adding the author in the Likes Table.
      await Like.create({
        userEmail: user.email,
        bookId: bookToLike.id,
      });

      //Updating book to increase count of likes in book
      const updatedBook = await Book.update(
        { likes: bookToLike.likes + 1 },
        {
          where: {
            id: bookToLike.id,
          },
        }
      );

      res.status(200).send(updatedBook);
    }
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
};

const reviewOnABook = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      res.status(400).send(`Please send Comment with request`);
    }

    // Getting user who commented.
    const user = await User.findByPk(req.user.email);

    // Getting Book on which user wants to comment
    const book = await Book.findByPk(req.params.id);

    // Validating user input
    if (!book) {
      res.status(400).send(`Book not found`);
    }

    //Adding a comment
    await Comment.create({
      comment,
      bookId: book.id,
      userEmail: user.email,
    });

    res.status(200).send(`Added Comment`);
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
};

const showMyBooks = async (req, res) => {
  const user = await User.findByPk(req.user.email);

  const books = await Book.findAll({
    where: {
      addedBy: user.email,
      status: 'Active',
    },
  });

  res.status(200).send(books);
};
module.exports = {
  showAllBooks,
  showBookWithId,
  addBook,
  deleteBook,
  likeABook,
  reviewOnABook,
  showMyBooks,
};
