import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("school", { schema: "Polydate" })
export class School {
  @PrimaryGeneratedColumn({ type: "int", name: "school_id" })
  schoolId: number;

  @Column("varchar", { name: "school_label", length: 150 })
  schoolLabel: string;
}
