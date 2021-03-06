import { provide, Type, NgZone }                              from '@angular/core';
import { ComponentFixture, TestComponentBuilder }     from '@angular/compiler/testing';
import { Control }                                    from '@angular/common';
import { HTTP_PROVIDERS, BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { App, Config, Form, NavController, Platform, Events } from 'ionic-angular';
import { ConfigMock, NavMock, PlatformMock }          from './mocks';
import { TranslateService, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
import { UserData }                                   from '../app/providers/user-data';
export { TestUtils }                                  from './testUtils';

function createNgZone(): NgZone {
  return new NgZone({enableLongStackTrace: true});
}

export let providers: Array<any> = [
  provide(Platform, {useClass: PlatformMock}),
  provide(Config, {useClass: ConfigMock}),
  provide(App, {useClass: ConfigMock}),
  provide(NavController, {useClass: NavMock}), 
  UserData,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  }),
  TranslateService,
  Events,
  Http,  HTTP_PROVIDERS, BaseRequestOptions, ConnectionBackend,
  provide(NgZone, {useFactory: createNgZone}),
];
