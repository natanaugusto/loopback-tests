import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Course, CourseRelations, Studant} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StudantRepository} from './studant.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {

  public readonly studants: HasManyRepositoryFactory<Studant, typeof Course.prototype.id>;

  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource, @repository.getter('StudantRepository') protected studantRepositoryGetter: Getter<StudantRepository>,
  ) {
    super(Course, dataSource);
    this.studants = this.createHasManyRepositoryFactoryFor('studants', studantRepositoryGetter,);
    this.registerInclusionResolver('studants', this.studants.inclusionResolver);
  }
}
