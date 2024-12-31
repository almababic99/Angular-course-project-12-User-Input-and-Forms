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
    const enteredEmail = formData.form.value.email;   // This accesses the email value from the form.
    const enteredPassword = formData.form.value.password;  // This accesses the password value from the form.

    console.log(enteredEmail);
    console.log(enteredPassword);
  }
}
