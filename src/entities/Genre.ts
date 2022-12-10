import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("IDX_b59c518909596e3c7d465202cf", ["genreLabel"], { unique: true })
@Index("unq_genre", ["genreLabel"], { unique: true })
@Entity("genre", { schema: "Polydate" })
export class Genre {
  @PrimaryGeneratedColumn({ type: "int", name: "genre_id" })
  genreId: number;

  @Column("varchar", { name: "genre_label", unique: true, length: 100 })
  genreLabel: string;
}
