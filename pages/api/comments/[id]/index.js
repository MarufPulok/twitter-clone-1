import connectMongo from "@/db/dbConnect";
import CommentDB from "@/db/models/commentModel";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })

  if (req.method == "GET") {
    try {
      await connectMongo();
      const comments = await CommentDB.findOne({ head: req.query.id })
        .populate("nodes")
        .sort({ createdDate: -1 });

      return res.status(200).json({ msg: "Success", comments });
    } catch (error) {
      return res.status(500).json({ msg: "Server error" });
    }
  }
  if (req.method == "DELETE") {
    const id = req.query;
    console.log(id);
    try {
      // const session = await getServerSession(req, res, authOptions);

      // const comment = await CommentDB.findById(id);

      const [session, comment] = await Promise.all([
        getServerSession(req, res, authOptions),
        CommentDB.findById(id),
      ]);

      if (session.user.id != comment.owner) {
        return res.status(401).json({ msg: "Not authorized" });
      }

      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }

      await CommentDB.findByIdAndDelete(id);
      return res.status(200).json({ msg: "Comment deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal server error", error });
    }
  }
}
