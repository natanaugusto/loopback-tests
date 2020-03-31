import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Studant,
  Department,
} from '../models';
import {StudantRepository} from '../repositories';

export class StudantDepartmentController {
  constructor(
    @repository(StudantRepository)
    public studantRepository: StudantRepository,
  ) { }

  @get('/studants/{id}/department', {
    responses: {
      '200': {
        description: 'Department belonging to Studant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Department)},
          },
        },
      },
    },
  })
  async getDepartment(
    @param.path.number('id') id: typeof Studant.prototype.id,
  ): Promise<Department> {
    return this.studantRepository.department(id);
  }
}
