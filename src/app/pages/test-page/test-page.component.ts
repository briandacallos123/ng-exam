import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-test-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
})
export class TestPageComponent {
  days = ['monday', 'tuesday', 'wednesday'];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form after the constructor is called
    this.form = this.fb.group({
      hobbies: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.form.get('hobbies')?.valueChanges.subscribe({
      next: (data) => {
        console.log(data, 'hobbies');
      },
    });
  }

  get hobbies() {
    return this.form.controls['hobbies'] as FormArray;
  }
  addHobby() {
    const scheduleArray = this.fb.array(
      this.days.map(() => this.fb.control(false))
    );

    const hobby = this.fb.group({
      title: ['', Validators.required],
      schedule: scheduleArray,
    });

    this.hobbies.push(hobby);
  }

  deleteLesson(lessonIndex: number) {
    this.hobbies.removeAt(lessonIndex);
  }

  onSubmit() {
    console.log(this.form, '//////////');
    alert('wew');
  }
}
