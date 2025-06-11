import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DBService } from '../../shared/services/DB.service';
import { BehaviorSubject, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { presentAddressT } from '../../shared/models/address.model';
import { Places } from '../../shared/services/Places.service';
import { FormInputComponent } from '../../components/forms/form-input/form-input.component';
import {
  nameWithoutNumber,
  ageValidator,
  guardianRequiredValidator,
  isEqualValue,
} from '../../validators/form.validators';
import { FormSelectComponent } from '../../components/forms/form-select/form-select.component';
import { UserService } from '../../shared/services/User.service';

// export function isEqualValue(
//   controlName: string,
//   matchingControlName: string
// ): ValidatorFn {
//   return (group: AbstractControl): ValidationErrors | null => {
//     const control = group.get(controlName);
//     const matchingControl = group.get(matchingControlName);

//     if (!control || !matchingControl) return null;

//     const errorExists = control.value !== matchingControl.value;

//     if (errorExists) {
//       matchingControl.setErrors({ valuesNotEqual: true });
//       // Optionally, you can also set error on control
//       // control.setErrors({ valuesNotEqual: true });
//       return { valuesNotEqual: true };
//     } else {
//       // Clear the error if values match
//       if (matchingControl.errors && matchingControl.errors['valuesNotEqual']) {
//         const errors = { ...matchingControl.errors };
//         delete errors['valuesNotEqual'];
//         matchingControl.setErrors(Object.keys(errors).length ? errors : null);
//       }
//       return null;
//     }
//   };
// }

export function atLeastOneCheckedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }
    const atLeastOneChecked = control.controls.find((item) => item.value);
    return atLeastOneChecked ? null : { atLeastOneRequired: true };
  };
}

const luzonCodes = ['01', '02', '03', '04', '05', '13', '14', '17'];
const visayasCodes = ['06', '07', '08', '18'];
const mindanaoCodes = ['09', '10', '11', '12', '16', '15'];

function getIslandGroup(code: string) {
  const prefix = code.slice(0, 2); // e.g., '01', '13'
  if (luzonCodes.includes(prefix)) return 'Luzon';
  if (visayasCodes.includes(prefix)) return 'Visayas';
  if (mindanaoCodes.includes(prefix)) return 'Mindanao';
  return 'Unknown';
}

@Component({
  selector: 'app-new',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormInputComponent,
    FormSelectComponent,
  ],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
  private destoryRef = inject(DestroyRef);
  private PlacesService = inject(Places);
  private UserService = inject(UserService);
  formSubmitted = false;
  isLoading = false;
  days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  presentAddress: presentAddressT = {
    islandGroup: ['luzon', 'visayas', 'mindanao'],
    regions: [],
    city: [],
  };
  permanentAddress: presentAddressT = {
    islandGroup: ['luzon', 'visayas', 'mindanao'],
    regions: [],
    city: [],
  };

  // Inject FormBuilder

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, nameWithoutNumber]],
        age: ['', [Validators.required, ageValidator]],
        gender: ['', Validators.required],
        guardianName: [''],
        userNames: this.fb.group(
          {
            username: ['', Validators.required],
            confirmUsername: ['', Validators.required],
          },
          {
            validators: [isEqualValue()],
          }
        ),
        presentAddress: this.fb.group({
          islandGroup: ['', Validators.required],
          region: ['', Validators.required],
          city: ['', Validators.required],
        }),
        isPermanentAddOpen: [false],
        permanentAddress: this.fb.group({
          islandGroup: ['', Validators.required],
          region: ['', Validators.required],
          city: ['', Validators.required],
        }),
        hobbies: this.fb.array([
          this.fb.group({
            name: ['', Validators.required],
            schedule: this.fb.array(
              this.days.map(() => this.fb.control(false)),
              {
                validators: [atLeastOneCheckedValidator()],
              }
            ),
            budget: ['', Validators.required],
            isEveryday: [''],
          }),
        ]), // Initialize as an empty FormArray
      },
      {
        validators: [guardianRequiredValidator()],
      }
    );
  }
  // Use FormBuilder to create the form

  get isPermanentOpen(): boolean {
    return this.form.get('isPermanentAddOpen')?.value === true;
  }

  ngOnInit(): void {
    this.loadPresentRegions();
    this.loadPresentCities();
    this.loadPermanentRegions();
    this.loadPermanentCities();
    this.scheduleWatcher();

    this.fetchUsernameOnType();
  }

  fetchUsernameOnType() {
    this.form
      .get('userNames.username')
      ?.valueChanges?.pipe(
        tap((d) => {
          this.isLoading = true;
        }),
        debounceTime(400)
      )
      ?.subscribe({
        next: (value) => {
          this.isLoading = false;
          this.UserService.getUsers().subscribe({
            next: (d) => {
              console.log(d);
              const isAlreadyUsed = d?.find((item) => item.name === value);
              if (isAlreadyUsed) {
                this.form
                  .get('userNames.username')
                  ?.setErrors({ usernameAlreadyUsed: true });
              }
            },
          });
        },
      });
  }

  get getHobbies(): FormArray {
    return this.form.get('hobbies') as FormArray;
  }

  addNewHobby() {
    const scheduleControls = this.days.map(() => this.fb.control(false));
    const schedule = this.fb.array(scheduleControls, {
      validators: [atLeastOneCheckedValidator()],
    });
    const hobby = this.fb.group({
      name: ['', Validators.required],
      schedule,
      budget: ['', Validators.required],
      isEveryday: [''],
    });

    this.getHobbies.push(hobby);
  }

  onRemoveHobby(index: number) {
    this.getHobbies.removeAt(index);
  }

  onCheckEveryday(e: Event, index: number) {
    const isChecked = (e.target as HTMLInputElement).checked;

    // Get the hobbies FormArray
    const hobbiesArray = this.form.get('hobbies') as FormArray;

    // Get the specific hobby FormGroup
    const hobbyGroup = hobbiesArray.at(index) as FormGroup;

    const scheduleArray = hobbyGroup.get('schedule') as FormArray;

    scheduleArray.controls.forEach((control) => {
      control.setValue(isChecked);
    });
  }

  scheduleWatcher() {
    this.form
      .get('hobbies')
      ?.valueChanges?.pipe(debounceTime(100))
      ?.subscribe({
        next: (target) => {
          const hobbiesArr = this.form.get('hobbies') as FormArray;
          hobbiesArr.controls.forEach((hobbyGroup, index) => {
            const isEveryday = hobbyGroup.get('isEveryday')?.value;
            const schedule = hobbyGroup.get('schedule') as FormArray;
            const isAllChecked = schedule.controls.every(
              (control) => control.value
            );

            if (isEveryday) {
              schedule.controls.forEach((control) => {
                if (!control.value) {
                  control.setValue(true, { emitEvent: false }); // Prevent infinite loop
                }
              });
            } else {
              const isAllChecked = schedule.controls.every(
                (control) => control.value
              );
              if (!isAllChecked && hobbyGroup.get('isEveryday')?.value) {
                hobbyGroup
                  .get('isEveryday')
                  ?.setValue(false, { emitEvent: false });
              } else if (isAllChecked) {
                hobbyGroup
                  .get('isEveryday')
                  ?.setValue(true, { emitEvent: false });
              }
            }
          });
        },
      });
  }

  // present address
  loadPresentRegions() {
    const subscribe = this.loadRegions('presentAddress.islandGroup')?.subscribe(
      {
        next: (result) => {
          this.presentAddress.regions = result;
        },
      }
    );
    this.destoryRef.onDestroy(() => {
      subscribe?.unsubscribe();
    });
  }

  loadPresentCities() {
    this.loadCities('presentAddress.region')?.subscribe({
      next: (result) => {
        this.presentAddress.city = result;
      },
    });
  }

  // permanent address
  loadPermanentRegions() {
    const subscribe = this.loadRegions(
      'permanentAddress.islandGroup'
    )?.subscribe({
      next: (result) => {
        this.permanentAddress.regions = result;
      },
    });

    this.destoryRef.onDestroy(() => {
      subscribe?.unsubscribe();
    });
  }

  loadPermanentCities() {
    this.loadCities('permanentAddress.region')?.subscribe({
      next: (result) => {
        this.permanentAddress.city = result;
      },
    });
  }

  loadRegions(fieldName: string) {
    return this.form.get(fieldName)?.valueChanges?.pipe(
      switchMap((v: any) => {
        return this.PlacesService.getAllRegions?.pipe(
          map((data: any) => data.data),
          map((regions: any[]) =>
            regions
              .map((item) => ({
                name: item.name,
                region: getIslandGroup(item.code),
                code: item.code,
              }))
              .filter((item) => item.region.toLowerCase() === v.toLowerCase())
              .map((item) => ({ name: item.name, code: item.code }))
          )
        );
      })
    );
  }

  loadCities(fieldName: string) {
    return this.form.get(fieldName)?.valueChanges.pipe(
      switchMap((val) => {
        const code = this.permanentAddress.regions?.find(
          (item) => item.name === val
        )!.code;

        return this.PlacesService.getAllCities(code).pipe(
          map((d: any) => d?.data?.map((item: any) => item?.name))
        );
      })
    );
  }

  getErrorMessage(targetInput: string): string {
    const control = this.form.get(targetInput);
    if (!control) return '';

    const shouldShowError = control.touched || this.formSubmitted;

    if (!shouldShowError || !control.errors) return '';

    if (control.errors['required']) return 'Field is required';
    if (control.errors['containsNumber']) return 'Please use letters only';
    if (control.errors['hasLetters']) return 'Please use numbers only';
    if (control.errors['guardianRequired']) return 'Guardian is required';
    if (control.errors['confirmUsernameNotEqual'])
      return 'This must match the username you entered above';
    if (control.errors['ageRangeError'])
      return 'Age should be between 12 to 100 only';
    if (control.errors['usernameAlreadyUsed']) return 'username already used!';

    return 'Invalid input';
  }

  validateEachHobbies() {
    const hobbies = this.form.get('hobbies') as FormArray;
    hobbies.controls.forEach((formGroup, index) => {
      const schedule = formGroup.get('schedule') as FormArray;

      if (schedule?.errors?.['atLeastOneRequired']) {
        console.log('yey');
      }
    });
  }

  getSchedulError(index: number): boolean {
    if (index === null) return false;
    const arr = this.form.get('hobbies') as FormArray;
    const group = arr.at(index) as FormGroup;
    const schedule = group.get('schedule') as FormArray;

    if (schedule?.errors?.['atLeastOneRequired'] && this.formSubmitted) {
      return true;
    }
    return false;
  }

  onSubmit() {
    this.formSubmitted = true;
    const hobbiesArray = this.form.get('hobbies') as FormArray;
    hobbiesArray.controls.forEach((hobbyGroup) => {
      const schedule = hobbyGroup.get('schedule') as FormArray;
      schedule.markAllAsTouched();
      schedule.updateValueAndValidity();
    });
    this.validateEachHobbies();

    console.log(this.form);
  }
}
