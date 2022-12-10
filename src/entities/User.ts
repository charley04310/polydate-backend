import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Image } from "./Image";
import { LikeComment } from "./LikeComment";
import { LikePost } from "./LikePost";
import { Match } from "./Match";
import { Message } from "./Message";
import { Post } from "./Post";
import { Session } from "./Session";

@Entity("user", { schema: "Polydate" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id" })
  userId: number;

  @Column("int", { name: "user_role_id", default: () => "'1'" })
  userRoleId: number;

  @Column("int", { name: "user_stat_id", default: () => "'1'" })
  userStatId: number;

  @Column("int", { name: "user_ici_pour_id" })
  userIciPourId: number;

  @Column("int", { name: "user_genre_id" })
  userGenreId: number;

  @Column("varchar", { name: "user_email", length: 100 })
  userEmail: string;

  @Column("varchar", { name: "user_firstname", length: 100 })
  userFirstname: string;

  @Column("varchar", { name: "user_lastname", length: 100 })
  userLastname: string;

  @Column("varchar", { name: "user_password", length: 200 })
  userPassword: string;

  @Column("varchar", { name: "user_city", length: 100 })
  userCity: string;

  @Column("int", { name: "user_like_got", default: () => "'0'" })
  userLikeGot: number;

  @Column("int", { name: "user_like_given", default: () => "'0'" })
  userLikeGiven: number;

  @OneToMany(() => Comment, (comment) => comment.commentUser)
  comments: Comment[];

  @OneToMany(() => Image, (image) => image.imageUser)
  images: Promise<Image[]>;

  @OneToMany(() => LikeComment, (likeComment) => likeComment.likeCommentUser)
  likeComments: LikeComment[];

  @OneToMany(() => LikePost, (likePost) => likePost.likePostUser)
  likePosts: LikePost[];

  @OneToMany(() => Match, (match) => match.matchSrc)
  matches: Match[];

  @OneToMany(() => Match, (match) => match.matchDst)
  matches2: Match[];

  @OneToMany(() => Message, (message) => message.messageUser)
  messages: Message[];

  @OneToMany(() => Post, (post) => post.postUser)
  posts: Post[];

  @OneToMany(() => Session, (session) => session.sessionUser)
  sessions: Session[];
}
