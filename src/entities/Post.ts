import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { LikePost } from "./LikePost";
import { Stat } from "./Stat";
import { User } from "./User";
import { Image } from "./Image";

@Index("fk_post_image", ["postImageLink"], {})
@Index("fk_post_stat", ["postStatId"], {})
@Index("fk_post_user", ["postUserId"], {})
@Entity("post", { schema: "Polydate" })
export class Post {
  @PrimaryGeneratedColumn({ type: "int", name: "post_id" })
  postId: number;

  @Column("int", { name: "post_user_id" })
  postUserId: number;

  @Column("int", { name: "post_stat_id", default: () => "'1'" })
  postStatId: number;

  @Column("varchar", {
    name: "post_image_link",
    nullable: true,
    length: 255,
    default: () => "'/'",
  })
  postImageLink: string | null;

  @Column("varchar", { name: "post_content", length: 250 })
  postContent: string;

  @Column("timestamp", {
    name: "post_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  postDate: Date;

  @OneToMany(() => Comment, (comment) => comment.commentPost)
  comments: Comment[];

  @OneToMany(() => LikePost, (likePost) => likePost.likePost)
  likePosts: LikePost[];

  @ManyToOne(() => Stat, (stat) => stat.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_stat_id", referencedColumnName: "statId" }])
  postStat: Stat;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_user_id", referencedColumnName: "userId" }])
  postUser: User;

  @ManyToOne(() => Image, (image) => image.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_image_link", referencedColumnName: "imageLink" }])
  postImageLink2: Image;
}
