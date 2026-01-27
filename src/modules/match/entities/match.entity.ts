import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  type Relation,
} from 'typeorm';
import type { Player } from '../../player/entities/player.entity';
import type { Result } from '../../result/entities/result.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany('Player', 'matches')
  @JoinTable({
    name: 'match_players',
    joinColumn: { name: 'match_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'player_id', referencedColumnName: 'id' },
  })
  players: Relation<Player[]>;

  @OneToMany('Result', 'match')
  results: Relation<Result[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
