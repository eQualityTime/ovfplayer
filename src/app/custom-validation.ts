import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function OneOf(otherProperties: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'OneOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [otherProperties],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const theObject = <any>args.object;
          function isValid(element: string): boolean {
            const val = theObject[element];
            return val !== undefined && val !== null;
          }
          return (<Array<string>>args.constraints[0]).some(isValid);
        }
      }
    });
  };
}

export function Check2DArray(widthProperty: string, heightProperty: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Check2DArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [widthProperty, heightProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {

          const widthName = args.constraints[0];
          const heightName = args.constraints[1];

          const widthValue = (args.object as any)[widthName];
          const heightValue = (args.object as any)[heightName];

          if (value.length === heightValue) {
            let count = 0;
            for (const row of value) {
              count++;
              if (row.length !== widthValue) {
                this.message = `Row ${count} is of width ${row.length}, but it should be ${widthValue}`;
                return false;
              }
            }
            return true;
          } else {
            this.message = `Grid has ${value.length} rows but should have ${heightValue}`;
            return false;
          }
        },

        defaultMessage(args: ValidationArguments) {
          return this.message;
        }
      }
    });
  };
}
