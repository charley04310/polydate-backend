import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Match } from "./Match";

@Index("IDX_8b590f511beedcc0d907e31d45", ["typeMatchLabel"], { unique: true })
@Index("unq_type_match", ["typeMatchLabel"], { unique: true })
@Entity("type_match", { schema: "Polydate" })
export class TypeMatch {
  @PrimaryGeneratedColumn({ type: "int", name: "type_match_id" })
  typeMatchId: number;

  @Column("varchar", { name: "type_match_label", unique: true, length: 100 })
  typeMatchLabel: string;

  @OneToMany(() => Match, (match) => match.matchType)
  matches: Match[];
}
