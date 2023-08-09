interface IEntity {
  entityId: number;
  shortName: string;
  longName: string;
  creationDate: Date;
}

export class Entity implements IEntity {
  entityId: number;
  shortName: string;
  longName: string;
  creationDate: Date;

  constructor(entityId: number, shortName: string, longName: string, creationDate: Date) {
    this.entityId = entityId;
    this.shortName = shortName;
    this.longName = longName;
    this.creationDate = creationDate;
  }
}
