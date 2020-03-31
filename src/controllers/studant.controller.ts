import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Studant} from '../models';
import {StudantRepository} from '../repositories';

export class StudantController {
  constructor(
    @repository(StudantRepository)
    public studantRepository : StudantRepository,
  ) {}

  @post('/studants', {
    responses: {
      '200': {
        description: 'Studant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Studant)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Studant, {
            title: 'NewStudant',
            exclude: ['id'],
          }),
        },
      },
    })
    studant: Omit<Studant, 'id'>,
  ): Promise<Studant> {
    return this.studantRepository.create(studant);
  }

  @get('/studants/count', {
    responses: {
      '200': {
        description: 'Studant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Studant) where?: Where<Studant>,
  ): Promise<Count> {
    return this.studantRepository.count(where);
  }

  @get('/studants', {
    responses: {
      '200': {
        description: 'Array of Studant model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Studant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Studant) filter?: Filter<Studant>,
  ): Promise<Studant[]> {
    return this.studantRepository.find(filter);
  }

  @patch('/studants', {
    responses: {
      '200': {
        description: 'Studant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Studant, {partial: true}),
        },
      },
    })
    studant: Studant,
    @param.where(Studant) where?: Where<Studant>,
  ): Promise<Count> {
    return this.studantRepository.updateAll(studant, where);
  }

  @get('/studants/{id}', {
    responses: {
      '200': {
        description: 'Studant model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Studant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Studant, {exclude: 'where'}) filter?: FilterExcludingWhere<Studant>
  ): Promise<Studant> {
    return this.studantRepository.findById(id, filter);
  }

  @patch('/studants/{id}', {
    responses: {
      '204': {
        description: 'Studant PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Studant, {partial: true}),
        },
      },
    })
    studant: Studant,
  ): Promise<void> {
    await this.studantRepository.updateById(id, studant);
  }

  @put('/studants/{id}', {
    responses: {
      '204': {
        description: 'Studant PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() studant: Studant,
  ): Promise<void> {
    await this.studantRepository.replaceById(id, studant);
  }

  @del('/studants/{id}', {
    responses: {
      '204': {
        description: 'Studant DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.studantRepository.deleteById(id);
  }
}
