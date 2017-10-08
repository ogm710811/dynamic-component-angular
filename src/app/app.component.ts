import { AuthFormComponent } from './auth-form/auth-form.component';
import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, AfterContentInit, ComponentRef } from '@angular/core';
import { User } from '../app/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
dynamicComponent: ComponentRef<AuthFormComponent>;

  // using ViewChild we can comunicate directly with
  // the DOM where is declare the entry variable
  // so allow us to inject the AuthFormComponent in that place
  // passing a second argumant as a ViewChild (read property)
  // this essencially changes what we get back and we want to read
  // a ViewContainerRef
  @ViewChild('entry', { read: ViewContainerRef }) entry: ViewContainerRef;

  // ComponentFactoryResolver allows to create a component factory
  // base on the dynamic component that we import
  // and put it in the #entry variable defined as ViewContainerRef
  constructor(private resolver: ComponentFactoryResolver) {}

  // We use AfterContentInit instead of AfterContentView cause
  // we want to be the content initialize before the view
  ngAfterContentInit(): void {
    // 1. instancate the component (create the factory of our component)
    // 2. then create the component and injected
    const authFormFactory = this.resolver.resolveComponentFactory(AuthFormComponent);
    this.dynamicComponent = this.entry.createComponent(authFormFactory);

    // you can create multiple instances of the same component
    // const dynamicComponent1 = this.entry.createComponent(authFormFactory);
    // const dynamicComponent2 = this.entry.createComponent(authFormFactory);

    // IMPORTANT!! Dynamic Components don't apply the decorator @Input, so
    // how to access the Input Data of Dynamic Components?
    console.log(this.dynamicComponent.instance);
    // 1. access the title property and overwrite it
    this.dynamicComponent.instance.title = 'Create account';

    // how to access the Output Data of Dynamic Components?
    // 2. access the submitted event emitter
    this.dynamicComponent.instance.submitted.subscribe((user) => {
      this.loginUser(user);
    });

    // reordering components
    // 1. lets create another component without overwriting the title property
    this.entry.createComponent(authFormFactory);
    // 2. lets move this component in the DOM afterViewInit
    // using a button

  }

  loginUser(user: User) {
    console.log('Login', user);
  }

  // destroyimg dynamic component
  destroyComponent() {
    console.log(this.dynamicComponent);
    this.dynamicComponent.destroy();
  }

  moveComponent() {
    // second parameter of move method define the index of
    // the position where the component will show up
    this.entry.move(this.dynamicComponent.hostView, 1);
  }
}
