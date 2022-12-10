import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Index("fk_like_post_post", ["likePostId"], {})
@Index("unq_like_post", ["likeId", "likePostUserId"], { unique: true })
@Entity("like_post", { schema: "Polydate" })
export class LikePost {
  @PrimaryGeneratedColumn({ type: "int", name: "like_id" })
  likeId: number;

  @Column("int", { name: "like_post_user_id" })
  likePostUserId: number;

  @Column("int", { name: "like_post_id" })
  likePostId: number;

  @Column("timestamp", {
    name: "like_post_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  likePostDate: Date;

  @ManyToOne(() => Post, (post) => post.likePosts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "like_post_id", referencedColumnName: "postId" }])
  likePost: Post;

  @ManyToOne(() => User, (user) => user.likePosts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "like_post_user_id", referencedColumnName: "userId" }])
  likePostUser: User;
}
