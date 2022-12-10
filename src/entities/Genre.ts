import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("unq_genre", ["genreLabel"], { unique: true })
@Entity("genre", { schema: "Polydate" })
export class Genre {
  @PrimaryGeneratedColumn({ type: "int", name: "genre_id" })
  genreId: number;

  @Column("varchar", { name: "genre_label", unique: true, length: 100 })
  genreLabel: string;
}
