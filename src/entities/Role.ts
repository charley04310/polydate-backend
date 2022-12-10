import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("IDX_90d673e528dac2c8c214314391", ["roleLabel"], { unique: true })
@Index("unq_role", ["roleLabel"], { unique: true })
@Entity("role", { schema: "Polydate" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "role_id" })
  roleId: number;

  @Column("varchar", { name: "role_label", unique: true, length: 100 })
  roleLabel: string;
}
