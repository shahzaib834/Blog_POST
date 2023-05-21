const { prisma } = require('../config/db');
const crypto = require('crypto');

const showAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blogs.findMany({
      where: { status: 'Active' },
    });

    res.send(blogs);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const showBlogWithId = async (req, res) => {
  const id = Number(req.params.id);

  const blog = await prisma.blogs.findMany({
    where: {
      id,
      status: 'Active',
    },
    include: { user: { select: { name: true, email: true } } },
  });

  res.send(blog);
};

const addBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res
        .status(400)
        .send('Title Description And Category are required');
    }

    const user = await prisma.users.findUnique({
      where: {
        email: req.user.email,
      },
    });
    if (user) {
      const blog = await prisma.blogs.create({
        data: {
          id: crypto.randomUUID(),
          title,
          description,
          category,
          likes: 0,
          user: {
            connect: {
              email: user.email,
            },
          },
        },
      });
      return res.status(200).json({
        message: `Blog created Succesfully`,
        blog,
      });
    } else {
      return res.status(404).send(`User not found`);
    }
  } catch (err) {
    console.log(`Error : ${err.message}`);
    return res.status(404).send(`API Failed!`);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      res.status(404).send('Please send all fields');
    }

    // Getting user id
    const user = await User.findByPk(req.user.email);

    // Getting blog by its id
    const blog = await Blog.findByPk(req.params.id);

    // Checking if this blog belongs to the user who requested the update/edit.
    // Mapping through blogs of author to check if he is the owner of the blog.
    // const isSame = author.blogs.some(
    //   (value) => JSON.stringify(blog._id) === JSON.stringify(value)
    // );

    if (blog.author === user.email) {
      const editedBlog = await Blog.update(
        { title, description, category },
        {
          where: {
            id: blog.id,
          },
        }
      );

      res.status(200).send(editedBlog);
    } else {
      res
        .status(400)
        .send(`You don't own the blog so you cannot edit this blog.`);
    }
  } catch (err) {
    res.status(400);
    throw new Error(`Error : ${err.message}`);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogToDelete = await Blog.findByPk(req.params.id);

    if (!blogToDelete) {
      return res.status(400).send('Blog not found');
    }

    const user = await User.findByPk(req.user.email);

    // Checking if requested person owns the blog.
    const isOwner = await Blog.findAll({
      where: {
        author: user.email,
        id: blogToDelete.id,
      },
    });

    if (!isOwner.length) {
      return res.status(400).send(`You cannot delete this blog. No Permission`);
    }

    // Delete Blog From Blogs Model
    const deletedBlog = await Blog.update(
      { status: 'Disabled' },
      {
        where: {
          id: blogToDelete.id,
        },
      }
    );

    res.status(200).send(`Deleted Succesfully. ${deletedBlog}`);
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
};

const likeABlog = async (req, res) => {
  try {
    // Finding blog comming with params.
    const blogToLike = await Blog.findByPk(req.params.id);

    // Checking if user send a valid blog id
    if (!blogToLike) {
      res.status(400).send(`Error: No Blog found`);
    }

    // getting user id
    const user = await User.findByPk(req.user.email);

    //Checking if the user already liked the blog
    const alreadyLiked = await Like.findAll({
      where: {
        userEmail: user.email,
        blogId: blogToLike.id,
      },
    });

    if (alreadyLiked.length) {
      res.status(400).send(`You already liked the blog.`);
    } else {
      // Adding the author in the Likes Table.
      await Like.create({
        userEmail: user.email,
        blogId: blogToLike.id,
      });

      //Updating blog to increase count of likes in blog
      const updatedBlog = await Blog.update(
        { likes: blogToLike.likes + 1 },
        {
          where: {
            id: blogToLike.id,
          },
        }
      );

      res.status(200).send(updatedBlog);
    }
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
};

const commentOnABlog = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      res.status(400).send(`Please send Comment with request`);
    }

    // Getting user who commented.
    const user = await User.findByPk(req.user.email);

    // Getting Blog on which user wants to comment
    const blog = await Blog.findByPk(req.params.id);

    // Validating user input
    if (!blog) {
      res.status(400).send(`Blog not found`);
    }

    //Adding a comment
    await Comment.create({
      comment,
      blogId: blog.id,
      userEmail: user.email,
    });

    res.status(200).send(`Added Comment`);
  } catch (err) {
    res.status(400).send(`Error : ${err.message}`);
  }
};

const showMyBlogs = async (req, res) => {
  const user = await User.findByPk(req.user.email);

  const blogs = await Blog.findAll({
    where: {
      author: user.email,
      status: 'Active',
    },
  });

  res.status(200).send(blogs);
};
module.exports = {
  showAllBlogs,
  showBlogWithId,
  addBlog,
  updateBlog,
  deleteBlog,
  likeABlog,
  commentOnABlog,
  showMyBlogs,
};
