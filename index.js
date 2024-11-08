"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const creditSumInput = document.getElementById('creditSum');
const interestRateInput = document.getElementById('interestRate');
const creditTermInput = document.getElementById('creditTerm');
const currencyChangeSelect = document.getElementById('CurrencyChange');
function getCurrency(cur) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://api.exchangerate-api.com/v4/latest/RUB');
        const data = yield response.json();
        return data.rates[cur];
    });
}
(_a = document.querySelector("button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", calculateCredit);
function calculateCredit() {
    return __awaiter(this, void 0, void 0, function* () {
        const creditSum = +creditSumInput.value;
        const interestRate = +interestRateInput.value / 100;
        const creditTerm = +creditTermInput.value;
        const currencyChange = currencyChangeSelect.value;
        if (!creditSum || !interestRate || !creditTerm) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        if (creditSum <= 0 || interestRate <= 0 || creditTerm <= 0) {
            alert('Пожалуйста, введите корректные значения');
            return;
        }
        const monthPayment = creditSum * (interestRate / 12) / (1 - Math.pow(1 + (interestRate / 12), -creditTerm));
        const totalCoastCredit = monthPayment * creditTerm;
        try {
            const exchangeRate = yield getCurrency(currencyChange);
            const monthPaymentCurrency = monthPayment * exchangeRate;
            const totalCoastCreditCurrency = totalCoastCredit * exchangeRate;
            const convertTotalCurrency = totalCoastCredit / exchangeRate;
            const convertMonthPaymentCurrency = monthPayment / exchangeRate;
            const format = (num) => {
                return num.toLocaleString('ru-RU');
            };
            if (currencyChange === 'RUB') {
                document.getElementById("monthPayment").textContent = `${format(Math.round(monthPayment))} RUB`;
                document.getElementById("totalSum").textContent = `${format(Math.round(totalCoastCredit))} RUB`;
                document.getElementById("monthPaymentCurrency").textContent = `${format(Math.round(monthPaymentCurrency))} ${currencyChange}`;
                document.getElementById("totalSumCurrency").textContent = `${format(Math.round(totalCoastCreditCurrency))} ${currencyChange}`;
            }
            else {
                document.getElementById("monthPayment").textContent = `${format(Math.round(convertMonthPaymentCurrency))} RUB`;
                document.getElementById("totalSum").textContent = `${format(Math.round(convertTotalCurrency))} RUB`;
                document.getElementById("monthPaymentCurrency").textContent = `${format(Math.round(monthPayment))} ${currencyChange}`;
                document.getElementById("totalSumCurrency").textContent = `${format(Math.round(totalCoastCredit))} ${currencyChange}`;
            }
        }
        catch (error) {
            alert("Ошибка при получении валют");
            console.log(error);
        }
    });
}

