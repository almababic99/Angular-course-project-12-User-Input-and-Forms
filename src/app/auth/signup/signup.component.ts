import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// This custom validator checks if two form control values (in this case, the password and confirmPassword fields) are the same:
function equalValues(controlName1: string, controlName2: string) {
  // controlName1: Name of the first control (password).
  // controlName2: Name of the second control (confirmPassword)
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;  
      // If the values of both controls are equal, it returns null, indicating that there are no validation errors.
    }
    
    return { valuesNotEqual: true }; 
    // If the values are not equal, it returns an error object { valuesNotEqual: true }, which indicates a validation failure.
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    // This defines a FormGroup 'form' which is a collection of FormControl instances (individual form fields).
    email: new FormControl('', {
      // This FormControl is for the email field.
      validators: [Validators.required, Validators.email],
      // Validators.required ensures that the field is not empty and Validators.email ensures that the value is a valid email address.
    }),
    // Nested form group for password and confirm password:
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          // This FormControl is for the password field.
          validators: [Validators.required, Validators.minLength(6)],
          // Validators.required ensures that the field is not empty and Validators.minLength(6) ensures the password is at least 6 characters long.
        }),
        confirmPassword: new FormControl('', {
          // This FormControl is for the confirm password field.
          validators: [Validators.required, Validators.minLength(6)],
          // Validators.required ensures that the field is not empty and Validators.minLength(6) ensures the password is at least 6 characters long.
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],  // Custom validator for password match
      }
    ),
    firstName: new FormControl('', {
      // This FormControl is for the first name field.
      validators: [Validators.required], // It must not be empty (Validators.required).
    }),
    lastName: new FormControl('', {
      // This FormControl is for the last name field.
      validators: [Validators.required], // It must not be empty (Validators.required).
    }),
    // Nested form group for street, number, postal code and city:
    address: new FormGroup({
      street: new FormControl('', {
        // This FormControl is for the street field.
        validators: [Validators.required], // It must not be empty (Validators.required).
      }),
      number: new FormControl('', {
        // This FormControl is for the number field.
        validators: [Validators.required], // It must not be empty (Validators.required).
      }),
      postalCode: new FormControl('', {
        // This FormControl is for the postal code field.
        validators: [Validators.required], // It must not be empty (Validators.required).
      }),
      city: new FormControl('', {
        // This FormControl is for the city field.
        validators: [Validators.required], // It must not be empty (Validators.required).
      }),
    }),
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', {
      // This FormControl is for the role select field.
      // The role field is a dropdown where users can select from options like "student", "teacher", "employee", "founder", or "other".
      // Initially it is set to "student"
      validators: [Validators.required], // It must not be empty (Validators.required).
    }),
    source: new FormArray([
      // FormArray is used for handling multiple form controls that are part of an array (like a group of checkboxes).
      // In this case, each checkbox corresponds to an option for how the user found the site (Google, Friend, or Other).
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, {
      // This FormControl is for the agree checkbox field.
      // This FormControl represents a checkbox to agree to terms and conditions. Initially, the value is false, meaning unchecked.
      // Validators.required will ensure the user checks this checkbox before submitting the form.
      validators: [Validators.required], // It must not be empty (Validators.required).
    }),
  });

  onSubmit() {
    // This method is executed when the form is submitted.
    if (this.form.invalid) {
      console.log('Invalid form.');
      return;
    }

    console.log(this.form);
  }

  onReset() {
    // This method is triggered when the "Reset" button is clicked. It resets the form values, clearing any user input.
    this.form.reset();
  }
}
