import { BLE, BluetoothSerial } from 'ionic-native';
import { Events, Platform, NavController }   from 'ionic-angular';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing'
import { UserData } from './user-data';
import { BluetoothProvider } from './bluetooth';
import { GpsProvider } from './gps';
import { beforeEachProviders, describe, expect, inject, it } from '@angular/core/testing';
import { providers }   from '../../test/diExports';

class MockClass {
  public present(): any { return true; }
  public unsubscribe(): any { return true; }
  public json(): any { return true; }
}

function showToastStub(message: string, title: string, nav: NavController): any {
  'use strict';
  return null;
}

function publishStub(topic: string):any { return null; }
function bleToggleStub(value: boolean):any { return null; }
function isStub(platform: string):any { return true; }

function listFalseStub(arg: any): any {
  'use strict';

  let promise: Object = {
    then: function(callback: any): void {
      return callback([]); 
    }
  };
  return promise;
}

function listTrueStub(arg: any): any {
  'use strict';

  let promise: Object = {
    then: function(callback: any): void {
      return callback([1,2,3]); 
    }
  };
  return promise;
}

function writeStub(arg: any): any {
  'use strict';

  let promise: Object = {
    then: function(callback: any): void {
      return callback('{}'); 
    }
  };
  return promise;
}

function startScanStub(options: any): any {
  'use strict';

  let watcher: Object = {
    subscribe: function(callback: any, error: any): void {
      return callback(new MockClass());  
    }
  };
  return watcher;
}

describe('BluetoothProvider', () => {

  beforeEachProviders(() => providers);
  beforeEachProviders(() => [
    GpsProvider,
    BluetoothProvider
  ]);

  it('initialises', inject([ BluetoothProvider ], (bluetoothProvider) => {
    expect(bluetoothProvider).not.toBeNull();
  }));

  it('should ask for a vehicle', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.userData.plate = null;
    bluetoothProvider.bleToggle(true);
    expect(bluetoothProvider.userData.showToast).toHaveBeenCalled();
  }));

  it('should call bleToggleBrowser', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.userData.plate = 1;
    spyOn(bluetoothProvider, 'bleToggleBrowser').and.callFake(bleToggleStub);
    bluetoothProvider.bleToggle(true);
    expect(bluetoothProvider.bleToggleBrowser).toHaveBeenCalled();
    expect(bluetoothProvider.events.publish).toHaveBeenCalled();
  }));

  it('should have devices', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.bleToggleBrowser(true);
    expect(bluetoothProvider.bledevice).toBeNull();
    expect(bluetoothProvider.devices.length).toBe(3);
  }));

  it('should clear devices', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.bleToggleBrowser(false);
    expect(bluetoothProvider.devices.length).toBe(0);
  }));

  it('should alert about no devices', inject([ BluetoothProvider ], (bluetoothProvider) => {
    spyOn(BluetoothSerial, 'list').and.callFake(listFalseStub);
    bluetoothProvider.bleToggleMobile(true);
    expect(bluetoothProvider.userData.showToast).toHaveBeenCalled();
  }));

  it('should have ble devices', inject([ BluetoothProvider ], (bluetoothProvider) => {
    spyOn(BluetoothSerial, 'list').and.callFake(listTrueStub);
    bluetoothProvider.bleToggleMobile(true);
    expect(bluetoothProvider.devices.length).toBe(3);
  }));

  it('should unsubscribe ble', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.watcher = new MockClass();
    bluetoothProvider.bleToggleMobile(false);
    expect(bluetoothProvider.watcher).toBeNull();
  }));

  it('should disconnect ble device', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.bledevice = "device";
    bluetoothProvider.datastream = [];
    bluetoothProvider.devices = [];
    spyOn(BLE, 'disconnect').and.callFake(listFalseStub);
    spyOn(BLE, 'startScan').and.callFake(startScanStub);
    spyOn(BLE, 'stopScan').and.callFake(listFalseStub);
    bluetoothProvider.bleToggleMobileBLE(true);
    expect(BLE.disconnect).toHaveBeenCalled();
    expect(bluetoothProvider.datastream.length).toBe(2);
    expect(bluetoothProvider.devices.length).toBe(1);
  }));

  it('should stop ble scan', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.datastream = [];
    spyOn(BLE, 'stopScan').and.callFake(listFalseStub);
    bluetoothProvider.bleToggleMobileBLE(false);
    expect(bluetoothProvider.datastream.length).toBe(1);
  }));

  it('should send data to datastream', inject([ BluetoothProvider ], (bluetoothProvider) => {
    bluetoothProvider.datastream = [];
    bluetoothProvider.sendData();
    expect(bluetoothProvider.datastream.length).toBe(2);
  }));

  it('should send data to datastream ok', inject([ BluetoothProvider ], (bluetoothProvider) => {
    spyOn(bluetoothProvider.platform, 'is').and.callFake(isStub);
    spyOn(BluetoothSerial, 'isConnected').and.callFake(listTrueStub);
    spyOn(BluetoothSerial, 'write').and.callFake(writeStub);
    bluetoothProvider.datastream = [];
    bluetoothProvider.sendData();
    expect(bluetoothProvider.datastream.length).toBe(2);
  }));

  it('should fake device data', inject([ BluetoothProvider ], (bluetoothProvider) => {
    spyOn(bluetoothProvider, 'setBluetoothData').and.callFake(isStub);
    bluetoothProvider.bledeviceChanged('deviceMac');
    expect(bluetoothProvider.datastream.length).toBe(1);
    expect(bluetoothProvider.setBluetoothData).toHaveBeenCalled();
  }));

  it('should subscribe device', inject([ BluetoothProvider ], (bluetoothProvider) => {
    spyOn(bluetoothProvider.platform, 'is').and.callFake(isStub);
    spyOn(BluetoothSerial, 'connect').and.callFake(listTrueStub);
    spyOn(BluetoothSerial, 'subscribe').and.callFake(startScanStub);
    spyOn(bluetoothProvider, 'setBluetoothData').and.callFake(isStub);
    bluetoothProvider.bledeviceChanged('deviceMac');
    expect(bluetoothProvider.datastream.length).toBe(2);
    expect(bluetoothProvider.setBluetoothData).toHaveBeenCalled();
  }));
  
  it('should listen to userData events', inject([ BluetoothProvider ], (bluetoothProvider) => {
    spyOn(bluetoothProvider.events, 'subscribe').and.callFake(publishStub);
    bluetoothProvider.listenToUserDataEvents();
    bluetoothProvider.userData.logout();
    expect(bluetoothProvider.events.subscribe.calls.count()).toEqual(1);
  }));

});