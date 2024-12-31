import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],  //  This imports Angular's FormsModule, which is necessary for using ngModel and template-driven forms.
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  onSubmit(formData: NgForm) {   // This method is called when the form is submitted in login.component.html
    if (formData.form.invalid) {
      return;
    }
    // Angular automatically tracks the form's validity based on the HTML validation rules (like required, email, minlength) and the user’s input.
    // If any field is invalid (such as missing required input or invalid format), the form is considered invalid.
    // If the form is invalid, the method will exit early and prevent further execution, stopping the form from being submitted. 
    // This ensures that the data is only processed if the form is valid.

    const enteredEmail = formData.form.value.email;   // This accesses the email value from the form.
    const enteredPassword = formData.form.value.password;  // This accesses the password value from the form.

    console.log(enteredEmail);
    console.log(enteredPassword);
  }
}
