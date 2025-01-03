import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({  // This defines a FormGroup 'form' which is a collection of FormControl instances (individual form fields).
    email: new FormControl('', {  // This FormControl is for the email field.
      validators: [Validators.required, Validators.email]
      // Validators.required ensures that the field is not empty and Validators.email ensures that the value is a valid email address.
    }),
    password: new FormControl('', {  // This FormControl is for the password field. 
      validators: [Validators.required, Validators.minLength(6)]
      // Validators.required ensures that the field is not empty and Validators.minLength(6) ensures the password is at least 6 characters long.
    }),
  });

  onSubmit() {  // This method is executed when the form is submitted.
    console.log(this.form);
  }

  onReset() {  // This method is triggered when the "Reset" button is clicked. It resets the form values, clearing any user input.
    this.form.reset();
  }
}
