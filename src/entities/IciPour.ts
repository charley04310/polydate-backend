import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ici_pour", { schema: "Polydate" })
export class IciPour {
  @PrimaryGeneratedColumn({ type: "int", name: "ici_pour_id" })
  iciPourId: number;

  @Column("varchar", { name: "ici_pour_label", length: 150 })
  iciPourLabel: string;
}
