/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021, ©2022, ©2023, ©2024, ©2025
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
::END::LICENCE:: */

import { registerDecorator, ValidatorConstraintInterface } from 'class-validator';

// adapted from https://github.com/typestack/class-validator/issues/182#issuecomment-867636020

type AnyClass = { new(...args: any[]): any };

type PublicConstructor = new (...args: any[]) => any;

export type ClassValidationDecorator = <T extends AnyClass>(target: T) => PublicConstructor;

/** A helper method to create a new Class-level validation decorator. */
export function registerClassValidator(options: {
    name: string,
    validator: ValidatorConstraintInterface,
    constraints: any[],
}): ClassValidationDecorator {
    return function decorateClass<T extends AnyClass>(target: T): PublicConstructor {
        const { name, validator, constraints } = options;

        registerDecorator({
            name,
            target,
            propertyName: target.name,
            constraints,
            validator,
        });

        return target;
    };
}