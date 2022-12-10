import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Match } from "./Match";
import { User } from "./User";

@Index("fk_message_user", ["messageUserId"], {})
@Index("fk_message_match", ["messageMatchId"], {})
@Entity("message", { schema: "Polydate" })
export class Message {
  @PrimaryGeneratedColumn({ type: "int", name: "message_id" })
  messageId: number;

  @Column("int", { name: "message_user_id" })
  messageUserId: number;

  @Column("int", { name: "message_match_id" })
  messageMatchId: number;

  @Column("varchar", { name: "message_content", length: 250 })
  messageContent: string;

  @Column("timestamp", { name: "message_date", default: () => "'now()'" })
  messageDate: Date;

  @ManyToOne(() => Match, (match) => match.messages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "message_match_id", referencedColumnName: "matchId" }])
  messageMatch: Match;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "message_user_id", referencedColumnName: "userId" }])
  messageUser: User;
}
