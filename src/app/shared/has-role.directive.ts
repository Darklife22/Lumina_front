// src/app/shared/has-role.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { Role } from '../core/user-types';
import { AuthService } from '../core/auth.service';

@Directive({ selector: '[appHasRole]', standalone: true })
export class HasRoleDirective {
  private tpl = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);
  private auth = inject(AuthService);
  private roles: Role[] = [];

  @Input() set appHasRole(r: Role[]){ this.roles = r; this.update(); }
  constructor(){
    effect(() => { this.auth.role(); this.update(); });
  }
  private update(){
    this.vcr.clear();
    if (this.roles.length === 0 || this.auth.hasRole(this.roles)) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
