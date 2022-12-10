import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Stat } from "./Stat";
import { User } from "./User";
import { TypeMatch } from "./TypeMatch";
import { Message } from "./Message";

@Index("fk_match_stat", ["matchStatId"], {})
@Index("fk_match_type_match", ["matchTypeId"], {})
@Index("FK_match_user_a", ["matchSrcId"], {})
@Index("fk_match_user_b", ["matchDstId"], {})
@Index("unq_match", ["matchId"], { unique: true })
@Entity("match", { schema: "Polydate" })
export class Match {
  @PrimaryGeneratedColumn({ type: "int", name: "match_id" })
  matchId: number;

  @Column("int", { primary: true, name: "match_src_id" })
  matchSrcId: number;

  @Column("int", { primary: true, name: "match_dst_id" })
  matchDstId: number;

  @Column("int", { name: "match_stat_id", default: () => "'2'" })
  matchStatId: number;

  @Column("int", { name: "match_type_id" })
  matchTypeId: number;

  @Column("timestamp", {
    name: "match_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  matchDate: Date;

  @ManyToOne(() => Stat, (stat) => stat.matches, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "match_stat_id", referencedColumnName: "statId" }])
  matchStat: Stat;

  @ManyToOne(() => User, (user) => user.matches, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "match_src_id", referencedColumnName: "userId" }])
  matchSrc: User;

  @ManyToOne(() => User, (user) => user.matches2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "match_dst_id", referencedColumnName: "userId" }])
  matchDst: User;

  @ManyToOne(() => TypeMatch, (typeMatch) => typeMatch.matches, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "match_type_id", referencedColumnName: "typeMatchId" }])
  matchType: TypeMatch;

  @OneToMany(() => Message, (message) => message.messageMatch)
  messages: Message[];
}
