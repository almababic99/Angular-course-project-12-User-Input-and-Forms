// TEMPLATE-DRIVEN FORMS:
// Template-Driven Forms are best for simple forms, where the form structure and logic are defined mostly in the template using ngModel. 
// They offer two-way data binding and automatic validation with HTML attributes like required and minlength. 
// These forms are quick to set up but less flexible for dynamic content or complex logic.
// import {
//   afterNextRender,
//   Component,
//   DestroyRef,
//   inject,
//   viewChild,
// } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { debounceTime } from 'rxjs';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule], //  This imports Angular's FormsModule, which is necessary for using ngModel and template-driven forms.
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {
//   private form = viewChild.required<NgForm>('form');

//   private destroyRef = inject(DestroyRef);

//   constructor() {
//     afterNextRender(() => {  // The code inside this block (afterNextRender) will run once Angular has finished rendering the component's view. 
//       const savedForm = window.localStorage.getItem('saved-login-form'); 
//       // This attempts to retrieve any previously saved form data from the browser's localStorage.

//       if (savedForm) {
//         const loadedFormData = JSON.parse(savedForm);  // If there is any data in localStorage, it is parsed into an object.
//         const savedEmail = loadedFormData.email; 
//         setTimeout(() => { 
//           // setTimeout is used with a delay of 1ms to ensure that the form control's value is updated after Angular has finished rendering.
//           this.form().controls['email'].setValue(savedEmail);
//           // If there is a saved email, it sets the email field of the form to that saved value. 
//           // The setValue method programmatically updates the form control’s value.
//         }, 1);        
//       }

//       const subscription = this.form()
//         ?.valueChanges?.pipe(debounceTime(500))
//         // This sets up an observable that listens for changes to the form's value. It uses the valueChanges observable from the NgForm directive, 
//         // which emits whenever the form’s values change. The debounceTime(500) operator ensures that the form's data is saved to localStorage 
//         // only after 500ms have passed without changes (this reduces the number of times the data is saved).
//         .subscribe({
//           next: (value) =>
//             window.localStorage.setItem(
//               'saved-login-form',
//               JSON.stringify({ email: value.email })
//             ),
//             // Every time the form value changes, the email value is saved to localStorage. This allows the form's state to persist between page 
//             // reloads or when the user revisits the page.
//         });

//       this.destroyRef.onDestroy(() => subscription?.unsubscribe());
//       // The onDestroy method is used to clean up resources when the component is destroyed. Here, it ensures that the subscription to 
//       // valueChanges is properly unsubscribed when the component is no longer needed, preventing potential memory leaks.
//     });
//   }

//   onSubmit(formData: NgForm) {
//     // This method is called when the form is submitted in login.component.html
//     if (formData.form.invalid) {
//       return;
//     }
//     // Angular automatically tracks the form's validity based on the HTML validation rules (like required, email, minlength) and the user’s input.
//     // If any field is invalid (such as missing required input or invalid format), the form is considered invalid.
//     // If the form is invalid, the method will exit early and prevent further execution, stopping the form from being submitted.
//     // This ensures that the data is only processed if the form is valid.

//     const enteredEmail = formData.form.value.email; // This accesses the email value from the form.
//     const enteredPassword = formData.form.value.password; // This accesses the password value from the form.

//     console.log(enteredEmail);
//     console.log(enteredPassword);

//     formData.form.reset(); // this will clear the inputs and reset all the form fields to their initial state.
//   }
// }



// REACTIVE FORMS:
// Reactive Forms are more suitable for complex or dynamic forms, offering greater control. 
// They are defined in the component using FormControl and FormGroup, and validation is done explicitly with Angular's Validators. 
// They are more flexible, allowing dynamic changes and easier testing, making them ideal for forms with advanced logic or large-scale applications.
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };
}
// mustContainQuestionMark is a Custom Validator which ensures that the password must contain at least one question mark (?). 
// If the password (control.value) includes a question mark (?), it returns null, meaning no validation error.
// If the password does not include a question mark (?), it returns an error object { doesNotContainQuestionMark: true }. 
// This object signals that the validation failed and indicates that the password doesn't contain the required question mark.

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test2@example.com') {
    return of(null);
  }
  return of({ notUnique: true });
}
// emailIsUnique is a Async Validator that checks if the email value provided by the user is equal to 'test2@example.com'.
// If the email is not 'test2@example.com', it returns of(null), which signifies that there is no validation error (the email is unique).
// If the email is 'test2@example.com', it returns of({ notUnique: true }), indicating that the email is not unique and validation has failed.
// of() function from the RxJS library is used to return an observable. This is typical for asynchronous validators, which must return an observable.
// Returning null means there's no issue with the email, while returning an object ({ notUnique: true }) signals a validation failure.

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],  // Import ReactiveFormsModule to enable reactive forms.
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Creating a form group with two form controls (email and password).
  form = new FormGroup({
    email: new FormControl('', {
      validators: [ Validators.required, Validators.email ],
      asyncValidators: [emailIsUnique],
    }),  
    // A FormControl for email, initially empty.
    // validators ensure the email field is both required (not empty) and is in a valid email format.
    // asyncValidators: emailIsUnique function is called when the form is validated, and it checks if the email is unique.
    password: new FormControl('', {
      validators: [ Validators.required, Validators.minLength(6), mustContainQuestionMark ],
    })  
    // A FormControl for password, initially empty.
    // validators ensure the password field is both required (not empty) and has a minimum length of 6 characters and 
    // mustContainQuestionMark: Ensures the password contains at least one question mark (?).
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched && // Checks if the email input has been touched.
      this.form.controls.email.dirty && // Checks if the email input's value has been modified (i.e., the user has typed something in the field).
      this.form.controls.email.invalid // Checks if the email input has failed validation (e.g., if it is empty or not in a valid email format).
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched && // Checks if the password input has been touched.
      this.form.controls.password.dirty && // Checks if the password input's value has been modified (i.e., the user has typed something in the field).
      this.form.controls.password.invalid // Checks if the password input has failed validation (e.g., if it's empty or shorter than 6 characters).
    );
  }

  onSubmit() {    
    const enteredEmail = this.form.value.email; // This accesses the email value from the form.
    const enteredPassword = this.form.value.password;  // This accesses the password value from the form.

    console.log(enteredEmail);
    console.log(enteredPassword);
  }
}