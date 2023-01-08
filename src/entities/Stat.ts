import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Match } from "./Match";
import { Post } from "./Post";

@Index("unq_stat", ["statLabel"], { unique: true })
@Entity("stat", { schema: "Polydate" })
export class Stat {
  @PrimaryGeneratedColumn({ type: "int", name: "stat_id" })
  statId: number;

  @Column("varchar", {
    name: "stat_label",
    nullable: true,
    unique: true,
    length: 100,
  })
  statLabel: string | null;

  @OneToMany(() => Comment, (comment) => comment.commentStat)
  comments: Comment[];

  @OneToMany(() => Match, (match) => match.matchStat)
  matches: Match[];

  @OneToMany(() => Post, (post) => post.postStat)
  posts: Post[];
}
