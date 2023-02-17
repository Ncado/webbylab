import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActorsModel } from './actors.model';

@Injectable()
export class ActorsService {
  constructor(
    @InjectModel(ActorsModel) private actorsRepository: typeof ActorsModel,
  ) {}

  async createActor(value: string) {
    const actor = await this.actorsRepository.findOne({
      where: { name: value },
    });
    if (actor) {
      return actor;
    } else {
      try {
        const user = await this.actorsRepository.create({ name: value });
        return user;
      } catch (e) {
        console.log('->>>>>>>>>>>>>>>->>>>>>>>>>>>>>>->>>>>>>>>>>>>>>', e);
        console.log('->>>>>>>>>->>>>>>>>>>>>>>>->>>>>>>>>>>>>>>>>>>>>', value);
      }
    }
  }

  async getActors() {
    return await this.actorsRepository.findAll();
  }
}
