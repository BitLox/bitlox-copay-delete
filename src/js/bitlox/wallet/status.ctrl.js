(function(window, angular) {
    'use strict';

    angular.module('app.core')
        .controller('StatusCtrl', StatusCtrl);

    StatusCtrl.$inject = ['$scope', 'hidapi', 'WalletStatus', 'bleapi'];

    function StatusCtrl($scope, hidapi, WalletStatus, bleapi) {
      var sc = this;
        sc.bitlox = {
            isNative: document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'chrome-extension://' ) === -1 && document.URL.indexOf( 'https://' ) === -1,
            bleReady: false,
            knownDevices: {},
            numDevices: 0,
            connectAttempted: false,
            connected: false,
            status: "No Bitlox",
            alertClass: "danger"
        };

        sc.wallet = {
            status: "No Wallet",
            alertClass: "warning"
        };
        var api = hidapi;
        if(sc.bitlox.isNative) {
          /*
          "{"20:C3:8F:B5:DD:9C":{"address":"20:C3:8F:B5:DD:9C","rssi":-66,"name":"BITLOX","scanRecord":"AgEGBQLw/7D/Cv8AAP////9kAP8HCUJJVExPWAUSCAAQAAIKAAUSCAAQAAIKAAAAAAAAAAAAAAAAAAAAAAA=","advertisementData":{"kCBAdvDataManufacturerData":"AAD/////ZAD/","kCBAdvDataLocalName":"BITLOX","kCBAdvDataTxPowerLevel":0,"kCBAdvDataServiceUUIDs":["0000fff0-0000-1000-8000-00805f9b34fb","0000ffb0-0000-1000-8000-00805f9b34fb"]},"timeStamp":1490684995161}}"
          */

          api = bleapi;
          api.initialize();
          sc.connectBle = function(address) {
            api.connect(address)
          }
        }

        sc.refreshBitlox = function() {
            api.ping();
        };

        // this is just an example of how $scope and BleApi all tie together.
        api.$scope.$watch('bleReady', function(bleReady) {
            if(bleReady) {
              api.startScanNew();
            }
        });

        api.$scope.$watch('knownDevicesList', function(knownDevices) {
          sc.bitlox.knownDevices = knownDevices;
          // sc.bitlox.numDevices = Object.keys(knownDevices).length || 0
        })

        api.$scope.$watch('status', function(hidstatus) {
            console.warn(hidstatus)
            switch(hidstatus) {
            case api.STATUS_CONNECTED:
                sc.bitlox.connectAttempted = true;
                sc.bitlox.connected = true;
                sc.bitlox.status = "Bitlox connected";
                sc.bitlox.alertClass = "success";
                sc.bitlox.glyph = "glyphicon-ok";
                break;
            case api.STATUS_CONNECTING:
                sc.bitlox.connectAttempted = true;
                sc.bitlox.status = "Bitlox connecting";
                sc.bitlox.alertClass = "success";
                sc.bitlox.glyph = "glyphicon-refresh";
                break;
            case api.STATUS_DISCONNECTED:
                console.warn("DISCONNECTED");
                sc.bitlox.connected = false;
                sc.bitlox.status = "Bitlox disconnected!";
                sc.bitlox.alertClass = "danger";
                sc.bitlox.glyph = "glyphicon-remove";
                break;
            case api.STATUS_WRITING:
                sc.bitlox.connectAttempted = true;
                sc.bitlox.connected = true;
                sc.bitlox.status = "Bitlox writing";
                sc.bitlox.alertClass = "info";
                sc.bitlox.glyph = "glyphicon-upload";
                break;
            case api.STATUS_READING:
                sc.bitlox.connectAttempted = true;
                sc.bitlox.connected = true;
                sc.bitlox.status = "Bitlox reading";
                sc.bitlox.alertClass = "info";
                sc.bitlox.glyph = "glyphicon-download";
                break;
            default:
                sc.bitlox.connected = false;
                sc.bitlox.status = null;
            }
        });

        WalletStatus.$watch('status', function(walletstatus) {
            switch(walletstatus) {
            case WalletStatus.STATUS_LOADING:
                sc.wallet.status = "Loading wallet";
                sc.wallet.alertClass = "info";
                sc.wallet.glyph = "glyphicon-download";
                break;
            case WalletStatus.STATUS_LOADING_UNSPENT:
                sc.wallet.status = "Finding unspent outputs";
                sc.wallet.alertClass = "info";
                sc.wallet.glyph = "glyphicon-cloud-download";
                break;
            case WalletStatus.STATUS_LOADING_TRANSACTIONS:
                sc.wallet.status = "Finding transactions";
                sc.wallet.alertClass = "info";
                sc.wallet.glyph = "glyphicon-cloud-download";
                break;
            case WalletStatus.STATUS_SENDING:
                sc.wallet.status = "Wallet sending";
                sc.wallet.alertClass = "info";
                sc.wallet.glyph = "glyphicon-log-out";
                break;
            case WalletStatus.STATUS_SIGNING:
                sc.wallet.status = "Wallet signing";
                sc.wallet.alertClass = "info";
                sc.wallet.glyph = "glyphicon-pencil";
                break;
            default:
                sc.wallet.status = null;
            }
        });


    }

})(window, window.angular);
