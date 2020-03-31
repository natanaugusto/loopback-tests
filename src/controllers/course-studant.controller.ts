import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {Course, Studant} from '../models';
import {CourseRepository} from '../repositories';

export class CourseStudantController {
  constructor(
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) {}

  @get('/courses/{id}/studants', {
    responses: {
      '200': {
        description: 'Array of Course has many Studant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Studant)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Studant>,
  ): Promise<Studant[]> {
    return this.courseRepository.studants(id).find(filter);
  }

  @post('/courses/{id}/studants', {
    responses: {
      '200': {
        description: 'Course model instance',
        content: {'application/json': {schema: getModelSchemaRef(Studant)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Course.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Studant, {
            title: 'NewStudantInCourse',
            exclude: ['id'],
            optional: ['courseId']
          }),
        },
      },
    }) studant: Omit<Studant, 'id'>,
  ): Promise<Studant> {
    return this.courseRepository.studants(id).create(studant);
  }

  @patch('/courses/{id}/studants', {
    responses: {
      '200': {
        description: 'Course.Studant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Studant, {partial: true}),
        },
      },
    })
    studant: Partial<Studant>,
    @param.query.object('where', getWhereSchemaFor(Studant)) where?: Where<Studant>,
  ): Promise<Count> {
    return this.courseRepository.studants(id).patch(studant, where);
  }

  @del('/courses/{id}/studants', {
    responses: {
      '200': {
        description: 'Course.Studant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Studant)) where?: Where<Studant>,
  ): Promise<Count> {
    return this.courseRepository.studants(id).delete(where);
  }
}
