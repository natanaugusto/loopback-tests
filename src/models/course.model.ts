import {Entity, model, property, hasMany} from '@loopback/repository';
import {Studant} from './studant.model';

@model()
export class Course extends Entity {
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
  title: string;

  @hasMany(() => Studant)
  studants: Studant[];

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
