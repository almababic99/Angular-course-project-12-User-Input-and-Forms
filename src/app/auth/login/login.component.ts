import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], //  This imports Angular's FormsModule, which is necessary for using ngModel and template-driven forms.
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');

  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {  // The code inside this block (afterNextRender) will run once Angular has finished rendering the component's view. 
      const savedForm = window.localStorage.getItem('saved-login-form'); 
      // This attempts to retrieve any previously saved form data from the browser's localStorage.

      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);  // If there is any data in localStorage, it is parsed into an object.
        const savedEmail = loadedFormData.email; 
        setTimeout(() => { 
          // setTimeout is used with a delay of 1ms to ensure that the form control's value is updated after Angular has finished rendering.
          this.form().controls['email'].setValue(savedEmail);
          // If there is a saved email, it sets the email field of the form to that saved value. 
          // The setValue method programmatically updates the form control’s value.
        }, 1);        
      }

      const subscription = this.form()
        ?.valueChanges?.pipe(debounceTime(500))
        // This sets up an observable that listens for changes to the form's value. It uses the valueChanges observable from the NgForm directive, 
        // which emits whenever the form’s values change. The debounceTime(500) operator ensures that the form's data is saved to localStorage 
        // only after 500ms have passed without changes (this reduces the number of times the data is saved).
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({ email: value.email })
            ),
            // Every time the form value changes, the email value is saved to localStorage. This allows the form's state to persist between page 
            // reloads or when the user revisits the page.
        });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
      // The onDestroy method is used to clean up resources when the component is destroyed. Here, it ensures that the subscription to 
      // valueChanges is properly unsubscribed when the component is no longer needed, preventing potential memory leaks.
    });
  }

  onSubmit(formData: NgForm) {
    // This method is called when the form is submitted in login.component.html
    if (formData.form.invalid) {
      return;
    }
    // Angular automatically tracks the form's validity based on the HTML validation rules (like required, email, minlength) and the user’s input.
    // If any field is invalid (such as missing required input or invalid format), the form is considered invalid.
    // If the form is invalid, the method will exit early and prevent further execution, stopping the form from being submitted.
    // This ensures that the data is only processed if the form is valid.

    const enteredEmail = formData.form.value.email; // This accesses the email value from the form.
    const enteredPassword = formData.form.value.password; // This accesses the password value from the form.

    console.log(enteredEmail);
    console.log(enteredPassword);

    formData.form.reset(); // this will clear the inputs and reset all the form fields to their initial state.
  }
}
