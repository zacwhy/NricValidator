
Constants = {};
Constants.PrefixS = 'S';
Constants.PrefixT = 'T';
Constants.PrefixF = 'F';
Constants.PrefixG = 'G';
Constants.Weights = [2, 7, 6, 5, 4, 3, 2];
Constants.CheckDigitsST = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'Z', 'J'];
Constants.CheckDigitsFG = ['K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X'];

Constants.PreMilleniumPrefixes = [Constants.PrefixS, Constants.PrefixF];
Constants.PostMilleniumPrefixes = [Constants.PrefixT, Constants.PrefixG];
Constants.CitizenPrefixes = [Constants.PrefixS, Constants.PrefixT];
Constants.ForeignerPrefixes = [Constants.PrefixF, Constants.PrefixG];
Constants.ValidPrefixes = Constants.PreMilleniumPrefixes.concat(Constants.PostMilleniumPrefixes);

Constants.NumberLength = Constants.Weights.length;


function NricValidator(input) {
    this.input = input;
    this.prefix = input.charAt(0).toUpperCase();
    this.numbers = input.substring(1, Constants.NumberLength + 1);
    this.checkDigit = input.charAt(Constants.NumberLength + 1).toUpperCase();
}

// public
NricValidator.prototype.getValidCheckDigit = function () {
    var weightedSum = ValidatorHelper.getWeightedSum(Constants.Weights, this.numbers);
    var adjustedWeightedSum = ValidatorHelper.getAdjustedWeightedSum(weightedSum, this.prefix);
    var checkDigits = ValidatorHelper.getCheckDigits(this.prefix);
    var divisor = checkDigits.length;
    var index = divisor - weightedSum % divisor - 1;
    return checkDigits[index];
};

// private
NricValidator.prototype.validate = function () {
    ValidatorHelper.assert(this.prefix.length > 0, 'Must have prefix');
    ValidatorHelper.assert(ValidatorHelper.isValidPrefix(this.prefix), 'Prefix must be one of ' + Constants.ValidPrefixes);

    ValidatorHelper.assert(this.input.length == Constants.NumberLength + 2, 'NRIC length must be ' + (Constants.NumberLength + 2));

    ValidatorHelper.assert(this.numbers.length == Constants.NumberLength, 'Number length must be ' + Constants.NumberLength);
    ValidatorHelper.assert(this.checkDigit.length > 0, 'Must have check digit');

    // assert numbers are numbers
    // assert is valid check digit

    return this.getValidCheckDigit() == this.checkDigit;
}

// public
NricValidator.prototype.isValid = function () {
    try {
        return this.validate();
    } catch (e) {
        if (e instanceof AssertException) {
            alert(e.toString());
            return false;
        }
    }
}

ValidatorHelper = {};

(function () {

    var obj = {
        assert: function (condition, message) {
            if (!condition) {
                throw new AssertException(message);
            }
        },
        arrayContains: function (array, item){
            return array.indexOf(item) != -1;
        },

        isValidPrefix: function (prefix) {
            return this.arrayContains(Constants.ValidPrefixes, prefix);
        },
        isPreMilleniumPrefix: function (prefix) {
            return this.arrayContains(Constants.PreMilleniumPrefixes, prefix);
        },
        isPostMilleniumPrefix: function (prefix) {
            return this.arrayContains(Constants.PostMilleniumPrefixes, prefix);
        },
        isCitizenPrefix: function (prefix) {
            return this.arrayContains(Constants.CitizenPrefixes, prefix);
        },
        isForeignerPrefix: function (prefix) {
            return this.arrayContains(Constants.ForeignerPrefixes, prefix);
        },

        getWeightedSum: function (weights, numbers) {
            var result = 0;

            for (var i = 0; i < weights.length; i++) {
                result += weights[i] * numbers.charAt(i);
            }

            return result;
        },
        getAdjustedWeightedSum: function (weightedSum, prefix) {
            if (this.isPostMilleniumPrefix(prefix)) {
                weightedSum += 4;
            }

            return weightedSum;
        },

        getCheckDigits: function (prefix) {
            if (this.isCitizenPrefix(prefix)) {
                return Constants.CheckDigitsST;
            }
            if (this.isForeignerPrefix(prefix)) {
                return Constants.CheckDigitsFG;
            }
        },

        isNricValid: function (nric) {
            var validator = new NricValidator(nric);
            return validator.isValid();
        }
    };

    ValidatorHelper = obj;
})();

function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
    return 'AssertException: ' + this.message;
}
