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
      console.log(actor);
      return actor;
    }
    const user = await this.actorsRepository.create({ name: value });
    return user;
  }

  async getActors() {
    return await this.actorsRepository.findAll();
  }
}
