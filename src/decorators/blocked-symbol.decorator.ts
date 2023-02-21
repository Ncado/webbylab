import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function EachNotContainsSymbol(
  symbol: string,
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'eachNotContainsSymbol',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [symbol],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          function stringNotContainsSymbols(str) {
            const pattern = new RegExp(`[${args.constraints[0]}]`);
            return !pattern.test(str);
          }

          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] !== 'string') {
              return false;
            }
            if (value[i].length < 1) {
              return false;
            }
            if (!stringNotContainsSymbols(value[i])) {
              return false;
            }
          }

          return true;
        },
      },
    });
  };
}
