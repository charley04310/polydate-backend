import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import bcrypt from "bcrypt";
import { Image } from "./Image";
import { LikeComment } from "./LikeComment";
import { LikePost } from "./LikePost";
import { Match } from "./Match";
import { Message } from "./Message";
import { Post } from "./Post";
import { Session } from "./Session";
import * as jwt from "jsonwebtoken";
import config from "../init/config";
import { IsInt, Length, IsEmail, Min, Max, Contains } from "class-validator";
import { USER_ROLE, USER_STATE } from "../enums/enums";
export class UpdateUserDTO {
  @Length(2, 30)
  userFirstname: string;
  @Length(2, 30)
  userLastname: string;
  @Length(2, 30)
  userCity: string;
  @IsInt()
  userGenreId: number;
  @IsInt()
  userIciPourId: number;
}
export interface ICreateToken {
  userEmail: string;
  userPassword: string;
  userRoleId?: number;
  userId?: number;
}

@Entity("user", { schema: "Polydate" })
export class User extends UpdateUserDTO {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id" })
  userId: number;

  @Column("int", { name: "user_role_id", default: USER_ROLE.USER })
  userRoleId: number;

  @Column("int", { name: "user_stat_id", default: USER_STATE.VALIDE })
  userStatId: number;

  @Column("int", { name: "user_ici_pour_id" })
  @IsInt()
  @Min(1)
  @Max(3)
  userIciPourId: number;

  @Column("int", { name: "user_genre_id" })
  @IsInt()
  @Min(1)
  @Max(3)
  userGenreId: number;

  @Column("int", { name: "user_school_id" })
  @IsInt()
  @Min(1)
  @Max(2)
  userSchoolId: number;

  @Column("varchar", { name: "user_email", length: 100, unique: true })
  @IsEmail({}, { message: "L'email fourni est invalide" })
  userEmail: string;

  @Column("varchar", { name: "user_firstname", length: 100 })
  @Length(2, 30)
  userFirstname: string;

  @Column("varchar", { name: "user_lastname", length: 100 })
  @Length(2, 30)
  userLastname: string;

  @Column("varchar", { name: "user_description", length: 255 })
  @Length(0, 255)
  userDescription: string;

  @Column("varchar", { name: "user_password", length: 200 })
  userPassword: string;

  /*  @Column("varchar", {
    name: "user_image_link",
    length: 255,
    default: () => "/home",
  })
  userProfilImage: string; */

  @Column("varchar", { name: "user_city", length: 100 })
  @Length(3, 20)
  userCity: string;

  @Column("int", { name: "user_like_got", default: () => "'0'" })
  userLikeGot: number;

  @Column("int", { name: "user_like_given", default: () => "'0'" })
  userLikeGiven: number;
  /* 
  @Column("varchar", { name: "user_image_link", default: () => "/home" })
  useImageLink: string;
 */
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

  static setPassword(userPassword: string) {
    return (userPassword = bcrypt.hashSync(userPassword, 8));
  }
  static generateToken(user: ICreateToken) {
    return jwt.sign({ user }, this.isSecretKeyDefined(), { expiresIn: 86400 });
  }
  static isSecretKeyDefined(): string {
    if (config.jwt != undefined) {
      return config.jwt;
    }
    return "M?Y@R%!#!ES:%C#UE@SECR#IIET!";
  }
}
