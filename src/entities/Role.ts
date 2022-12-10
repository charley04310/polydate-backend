import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("unq_role", ["roleLabel"], { unique: true })
@Entity("role", { schema: "Polydate" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "role_id" })
  roleId: number;

  @Column("varchar", { name: "role_label", unique: true, length: 100 })
  roleLabel: string;
}
