import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const nameWithoutNumber = (
  control: AbstractControl
): ValidationErrors | null => {
  return /\d/.test(control.value) ? { containsNumber: true } : null;
};

export const isEqualValue = (): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const username = form.get('username')?.value;
    const confirmUsername = form.get('confirmUsername')?.value;

    if (!username || !confirmUsername) return null;
    if (username !== confirmUsername) {
      return { confirmUsernameNotEqual: true };
    }

    return null;
  };
};

export const ageValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!/^[0-9]+$/.test(control.value)) return { hasLetters: true };

  if (!(control.value >= 12 && control.value <= 100))
    return { ageRangeError: true };

  return null;
  // return /^[0-9]+$/.test(control.value) ? null : { hasLetters: true };
};

export const guardianRequiredValidator = (): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const age = group.get('age')?.value;
    const gender = group.get('gender')?.value;
    const guardianName = group.get('guardianName')?.value;

    if (Number(age) < 12 && gender === 'female' && !guardianName) {
      group.get('guardianName')?.setErrors({ guardianRequired: true });
      return { guardianRequired: true };
    } else {
      const errors = group.get('guardianName')?.errors;
      if (errors) {
        delete errors['guardianRequired'];
        if (Object.keys(errors).length === 0) {
          group.get('guardianName')?.setErrors(null);
        } else {
          group.get('guardianName')?.setErrors(errors);
        }
      }
      return null;
    }
  };
};
