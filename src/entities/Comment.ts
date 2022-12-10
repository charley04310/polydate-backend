import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { Stat } from "./Stat";
import { User } from "./User";
import { LikeComment } from "./LikeComment";

@Index("fk_comment_post", ["commentPostId"], {})
@Index("fk_comment_stat", ["commentStatId"], {})
@Index("fk_comment_user", ["commentUserId"], {})
@Entity("comment", { schema: "Polydate" })
export class Comment {
  @PrimaryGeneratedColumn({ type: "int", name: "comment_id" })
  commentId: number;

  @Column("int", { name: "comment_user_id" })
  commentUserId: number;

  @Column("int", { name: "comment_post_id" })
  commentPostId: number;

  @Column("varchar", { name: "comment_content", length: 250 })
  commentContent: string;

  @Column("int", { name: "comment_stat_id", default: () => "'1'" })
  commentStatId: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "comment_post_id", referencedColumnName: "postId" }])
  commentPost: Post;

  @ManyToOne(() => Stat, (stat) => stat.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "comment_stat_id", referencedColumnName: "statId" }])
  commentStat: Stat;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "comment_user_id", referencedColumnName: "userId" }])
  commentUser: User;

  @OneToMany(() => LikeComment, (likeComment) => likeComment.likeComment)
  likeComments: LikeComment[];
}
