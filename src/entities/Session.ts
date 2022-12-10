import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("fk_session_user", ["sessionUserId"], {})
@Entity("session", { schema: "Polydate" })
export class Session {
  @PrimaryGeneratedColumn({ type: "int", name: "session_id" })
  sessionId: number;

  @Column("int", { name: "session_user_id" })
  sessionUserId: number;

  @Column("varchar", { name: "session_ip", length: 50 })
  sessionIp: string;

  @Column("timestamp", {
    name: "session_start",
    default: () => "CURRENT_TIMESTAMP",
  })
  sessionStart: Date;

  @Column("timestamp", {
    name: "session_end",
    default: () => "CURRENT_TIMESTAMP",
  })
  sessionEnd: Date;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "session_user_id", referencedColumnName: "userId" }])
  sessionUser: User;
}
