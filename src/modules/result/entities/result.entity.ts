import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import type { Match } from '../../match/entities/match.entity';
import type { Player } from '../../player/entities/player.entity';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  matchId: string;

  @ManyToOne('Match', 'results', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Relation<Match>;

  @Column({ type: 'uuid' })
  winnerId: string;

  @ManyToOne('Player')
  @JoinColumn({ name: 'winnerId' })
  winner: Relation<Player>;

  @Column({ type: 'text' })
  score: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
