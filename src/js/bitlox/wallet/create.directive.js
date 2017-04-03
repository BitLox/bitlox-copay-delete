(function(window, angular) {
    'use strict';

    angular.module('app.wallet')
        .directive('walletCreate', walletCreate);

    walletCreate.$inject = ['Wallet', 'Toast', 'BIP39WordList', '$stateParams'];

    function walletCreate(Wallet, Toast, wordlist, $stateParams) {
        return {
            scope: {
                availableNumbers: '=',
                onFinish: '&',
            },
            templateUrl: 'views/bitlox/directive-create-bitlox-wallet.html',
            link: function(scope) {

                reset();

                scope.createWallet = function() {
                  console.log("CREATING WALLET NOW")
                    scope.creatingWallet = true;
                    Wallet.create(scope.newWallet.number, scope.newWallet).then(function() {

                    }, Toast.errorHandler).finally(function(res) {
                        reset();
                        scope.creatingWallet = false;
                        return scope.onFinish(res);
                    });
                };



                // wallets is on the parent scope, which this inherits
                scope.$watchCollection('availableNumbers', function(available) {
                    if (available && available.length) {
                        // also set some default values for that form
                        scope.newWallet.name = "Wallet " + available[0];
                        scope.newWallet.number = available[0];
                    }
                });
                scope.availableNumbers = $stateParams.availableNumbers;
                console.log("AVAILABLE WALLET NUMBERS")
                console.log(JSON.stringify(scope.availableNumbers))

                scope.updateWordNumbers = function() {
                    if (!scope.userWords) {
                        return;
                    }
                    var words = scope.userWords.split(/\s+/);
                    var numbers = [];
                    for (var i = 0; i < words.length; i++) {
                        var word = words[i];
                        var wordIndex = wordlist.indexOf(word);
                        if (wordIndex < 0) {
                            numbers[i] = "INVALID WORD";
                        } else {
                            numbers[i] = wordIndex;
                        }
                    }
                    scope.wordIndexes = numbers;
                };

                function reset() {
                    scope.newWallet = {
                        name: "Wallet",
                        number: 0,
                        isSecure: true,
                        isHidden: false,
                        isRestore: false,
                    };
                }


            }
        };
    }

})(window, window.angular);
