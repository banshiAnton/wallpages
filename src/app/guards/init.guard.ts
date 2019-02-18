import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from '../services/service.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InitGuard implements CanActivate {

  constructor(private service: ServiceService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.service.isInit().pipe(map((data: any) => data.success));
  }
}
