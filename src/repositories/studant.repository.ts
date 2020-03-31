import {DefaultCrudRepository} from '@loopback/repository';
import {Studant, StudantRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StudantRepository extends DefaultCrudRepository<
  Studant,
  typeof Studant.prototype.id,
  StudantRelations
> {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(Studant, dataSource);
  }
}
