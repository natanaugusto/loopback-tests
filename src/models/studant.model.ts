import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Studant extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'number',
  })
  courseId?: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Studant>) {
    super(data);
  }
}

export interface StudantRelations {
  // describe navigational properties here
}

export type StudantWithRelations = Studant & StudantRelations;
