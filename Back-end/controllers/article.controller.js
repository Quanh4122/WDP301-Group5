const { message } = require("antd");
const { db } = require("../models");

const article = db.article;

const CreateArticle = async (req, res) => {
  try {
    const dataSubmit = req.body.body;
    await article.insertMany(dataSubmit);
    res.status(200).json({ message: "Create Successfull !!" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const GetAllByUserKey = async (req, res) => {
  try {
    const key = req.query.key;
    const articleList = await article
      .find()
      .populate("author", "name avatar role")
      .populate("likes.userId", "name avatar role")
      .select("_id title content author dateCreated likes role");
    let newList = articleList.map((item) => {
      if (item.role == key || item.role == "") {
        let totalLike = 0;
        item._doc.likes.map((item) => {
          if (item.isLike == true) totalLike += 1;
        });
        return {
          ...item._doc,
          totalLike: totalLike,
        };
      }
    });
    newList = newList.filter((item) => item != null);
    res.status(200).json(newList);
  } catch (error) {
    res.status(500).json({ message: "Cannot Get All, Please check back-end" });
  }
};

const GetArticleAndReplyDetal = async (req, res) => {
  try {
    const key = req.query.key;
    const replyList = await article
      .findById(key)
      .populate("author", "name avatar role")
      .populate("reply._id", "name avatar role");
    // .select("_id reply");
    if (replyList) {
      res.status(200).json(replyList);
    } else {
      res.status(400).json({ message: "Cannot find any comment" });
    }
  } catch (error) {
    res.status(500).json({ message: "Cannot get" });
  }
};

const ReplyCompose = async (req, res) => {
  try {
    const articleId = req.body.params.key;
    const reply = req.body;
    await article
      .updateOne(
        { _id: articleId },
        {
          $push: {
            reply: {
              dateCreated: reply.body.dateCreated,
              content: reply.body.content,
              _id: reply.body._id,
            },
          },
        },
        { new: true }
      )
      .then(() => {
        res.status(200).json(reply);
      })
      .catch((error) => {
        res.status(500).json({ message: "Cannot Find or push" });
      });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const DeleteReply = async (req, res) => {
  try {
    const articleId = req.body.params.key;
    const reply = req.body;
    await article
      .updateOne(
        { _id: articleId },
        {
          $pull: {
            reply: {
              dateCreated: reply.body.dateCreated,
              content: reply.body.content,
              _id: reply.body._id,
            },
          },
        },
        { new: true }
      )
      .then(() => {
        res.status(200).json(reply);
      })
      .catch((error) => {
        res.status(500).json({ message: "Cannot Find or push" });
      });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const DeleteCompose = async (req, res) => {
  try {
    const articleId = req.query.key;
    await article.deleteOne({ _id: articleId });
    res.status(200).json({ message: "Delete successfull" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const LikeOrDislike = async (req, res) => {
  try {
    const articleId = req.body.params.key;
    const like = req.body.body;
    let atc = await article
      .findById(articleId)
      .populate("author", "name avatar role")
      .populate("likes.userId", "name avatar role")
      .select("_id title content author datecreated likes");
    if (atc.likes.length > 0) {
      atc.likes.map((item) => {
        if (item.userId == like.userId) {
          item.isLike = like.isLike;
        }
      });

      await article.updateOne(
        { _id: articleId },
        {
          $set: {
            likes: atc.likes.map((it) => {
              return {
                userId: it.userId,
                isLike: it.isLike,
              };
            }),
          },
        }
      );
    } else {
      await article.updateOne(
        { _id: articleId },
        {
          $push: {
            likes: like,
          },
        }
      );
    }

    res.status(200).json({ atc });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const GetAllFollowsByUserKey = async (req, res) => {
  try {
    const key = req.query.key;
    const articleList = await article
      .find()
      .populate("author", "name avatar role")
      .populate("likes.userId", "name avatar role")
      .select("_id title content author dateCreated likes role follows");
    let newList = articleList.map((item) => {
      if (item._doc.follows.includes(key)) {
        let totalLike = 0;
        item._doc.likes.map((item) => {
          if (item.isLike == true) totalLike += 1;
        });
        return {
          ...item._doc,
          totalLike: totalLike,
        };
      }
    });
    newList = newList.filter((item) => item != null);
    res.status(200).json(newList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cannot Get All, Please check back-end" });
  }
};

const putFollows = async (req, res) => {
  try {
    const data = req.body.body;
    console.log(data);
    await article.updateOne(
      { _id: data.articleId },
      {
        $push: {
          follows: data.userId,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "Oke" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cannot Put, Please check back-end" });
  }
};

module.exports = {
  GetAllByUserKey,
  ReplyCompose,
  DeleteReply,
  GetArticleAndReplyDetal,
  LikeOrDislike,
  CreateArticle,
  DeleteCompose,
  GetAllFollowsByUserKey,
  putFollows,
};
