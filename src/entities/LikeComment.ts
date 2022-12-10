import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { User } from "./User";

@Index("unq_like_comment", ["likeId", "likeCommentUserId"], { unique: true })
@Index("fk_like_comment_comment", ["likeCommentId"], {})
@Entity("like_comment", { schema: "Polydate" })
export class LikeComment {
  @PrimaryGeneratedColumn({ type: "int", name: "like_id" })
  likeId: number;

  @Column("int", { name: "like_comment_user_id" })
  likeCommentUserId: number;

  @Column("int", { name: "like_comment_id" })
  likeCommentId: number;

  @Column("timestamp", { name: "like_comment_date", default: () => "'now()'" })
  likeCommentDate: Date;

  @ManyToOne(() => Comment, (comment) => comment.likeComments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "like_comment_id", referencedColumnName: "commentId" }])
  likeComment: Comment;

  @ManyToOne(() => User, (user) => user.likeComments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "like_comment_user_id", referencedColumnName: "userId" },
  ])
  likeCommentUser: User;
}
