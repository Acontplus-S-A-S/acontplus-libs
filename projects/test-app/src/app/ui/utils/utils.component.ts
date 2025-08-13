import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatCardModule} from "@angular/material/card";
@Component({
  selector: 'app-utils',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule, MatCardModule],
  templateUrl: './utils.component.html',
  styleUrl: './utils.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class UtilsComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      arrayInput: [''],
      dateInput: [null],
      decimalInput: [''],
      numberInput: [''],
      objectInput: [''],
      regexInput: [''],
      stringInput: ['']
    });

    // Subscribe to form changes to process values
    this.form.valueChanges.subscribe(values => {
      try {


      } catch (error) {
        console.error('Error processing form values:', error);
      }
    });
  }

}
