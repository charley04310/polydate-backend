import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Index("unq_image", ["imageLink"], { unique: true })
@Index("fk_image_user", ["imageUserId"], {})
@Entity("image", { schema: "Polydate" })
export class Image {
  @PrimaryGeneratedColumn({ type: "int", name: "image_id" })
  imageId: number;

  @Column("int", { name: "image_user_id" })
  imageUserId: number;

  @Column("varchar", { name: "image_link", unique: true, length: 250 })
  imageLink: string;

  @Column("timestamp", { name: "image_date", default: () => "'now()'" })
  imageDate: Date;

  @ManyToOne(() => User, (user) => user.images, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "image_user_id", referencedColumnName: "userId" }])
  imageUser: User;

  @OneToMany(() => Post, (post) => post.postImageLink2)
  posts: Post[];
}
