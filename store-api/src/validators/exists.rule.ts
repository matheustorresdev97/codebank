import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityNotFoundError } from 'typeorm';
import { AppDataSource } from '../data-source'; // ajuste o caminho

export function Exists(
  entityClass: any,
  field = 'id',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      constraints: [entityClass, field],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!value) return false;

    try {
      const [entityClass, field] = args.constraints;
      const repository = AppDataSource.getRepository(entityClass); // ⚠️ aqui usamos a instância do DataSource
      const result = await repository.findOne({
        where: { [field]: value },
      });

      if (!result) {
        throw new EntityNotFoundError(entityClass, value);
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} not found`;
  }
}
