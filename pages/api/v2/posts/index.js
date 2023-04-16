import connectMongo from "@/db/dbConnect";
import PostDB from "@/db/models/postModel";
import TweetDBV2 from "@/db/modelsV2/tweetModelV2";
import { parseForm } from "@/helper/backend/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectMongo();

    // const { owner, tweetImage, tweetText } = req.body;

    //
    // if (!owner || !tweetText) {
    //   return res.status(400).json({ msg: "Missing required fields" });
    // }

    try {
      const { fields, files } = await parseForm(req);

      const tweetImage = files.tweetImage
        ? "/images/tweets/" + files.tweetImage?.newFilename
        : null;

      const { owner, tweetText } = fields;

      const post = await TweetDBV2.create({
        owner,
        tweetImage: tweetImage,
        tweetText: tweetText,
      });
      await post.populate({
        path: "owner",
        select: "username email image",
      });

      return res.status(201).json({ post });
    } catch (error) {
      return res.status(500).json({ msg: "Internal server error", error });
    }
  }

  //get methode

  // Get all posts
  else if (req.method === "GET") {
    try {
      const { skip = 0, limit = 5 } = req.query;

      await connectMongo();

      // Get all posts from the database
      const posts = await TweetDBV2.find({
        type: {
          $in: ["tweet", "retweet"],
        },
      })
        .populate({
          path: "owner",
          select: "username email image",
        })
        .populate({
          path: "head",
          populate: {
            path: "owner",
            // select: {},
          },
        })
        .populate({
          path: "commentsList",
          // select: "tweetText",
          populate: {
            path: "owner",
            select: "username image email _id",
          },
          options: { sort: { createdAt: -1 }, limit: 20 },
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return res.status(200).json({ posts });
    } catch (error) {
      return res.status(500).json({ msg: "Internal server error", ...error });
    }
  } else if (req.method === "DELETE") {
    await connectMongo();

    const postId = req.params.id;

    try {
      // Check if the post exists in the database
      const post = await TweetDBV2.findById(postId);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      // Delete the post from the database
      await post.remove();

      return res.status(200).json({ msg: "Post deleted successfully" });
    } catch (error) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  }

  return res.status(405).json({ msg: "Method not allowed" });
}
