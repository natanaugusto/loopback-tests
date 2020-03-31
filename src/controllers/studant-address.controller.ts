import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Studant,
  Address,
} from '../models';
import {StudantRepository} from '../repositories';

export class StudantAddressController {
  constructor(
    @repository(StudantRepository) protected studantRepository: StudantRepository,
  ) { }

  @get('/studants/{id}/address', {
    responses: {
      '200': {
        description: 'Studant has one Address',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Address),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Address>,
  ): Promise<Address> {
    return this.studantRepository.address(id).get(filter);
  }

  @post('/studants/{id}/address', {
    responses: {
      '200': {
        description: 'Studant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Address)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Studant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NewAddressInStudant',
            exclude: ['id'],
            optional: ['studantId']
          }),
        },
      },
    }) address: Omit<Address, 'id'>,
  ): Promise<Address> {
    return this.studantRepository.address(id).create(address);
  }

  @patch('/studants/{id}/address', {
    responses: {
      '200': {
        description: 'Studant.Address PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Partial<Address>,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.studantRepository.address(id).patch(address, where);
  }

  @del('/studants/{id}/address', {
    responses: {
      '200': {
        description: 'Studant.Address DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.studantRepository.address(id).delete(where);
  }
}
