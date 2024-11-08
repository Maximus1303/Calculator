
const creditSumInput = document.getElementById('creditSum') as HTMLInputElement;
const interestRateInput = document.getElementById('interestRate') as HTMLInputElement;
const creditTermInput = document.getElementById('creditTerm') as HTMLInputElement;
const currencyChangeSelect = document.getElementById('CurrencyChange') as HTMLSelectElement;

async function getCurrency(cur: string): Promise<number> {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
    const data = await response.json();
    return data.rates[cur];
}

document.querySelector("button")?.addEventListener("click", calculateCredit);

async function calculateCredit(): Promise<void> {
    const creditSum: number = +creditSumInput.value;
    const interestRate: number = +interestRateInput.value / 100;
    const creditTerm: number = +creditTermInput.value;
    const currencyChange: string = currencyChangeSelect.value;

    if (!creditSum || !interestRate || !creditTerm) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    if (creditSum <= 0 || interestRate <= 0 || creditTerm <= 0) {
        alert('Пожалуйста, введите корректные значения');
        return;
    }

    const monthPayment: number = creditSum * (interestRate / 12) / (1 - Math.pow(1 + (interestRate / 12), -creditTerm));
    const totalCoastCredit: number = monthPayment * creditTerm;

    try {
        const exchangeRate: number = await getCurrency(currencyChange);

        const monthPaymentCurrency: number = monthPayment * exchangeRate;
        const totalCoastCreditCurrency: number = totalCoastCredit * exchangeRate;
        const convertTotalCurrency: number = totalCoastCredit / exchangeRate;
        const convertMonthPaymentCurrency: number = monthPayment / exchangeRate;

        const format = (num: number) => {
            return num.toLocaleString('ru-RU');
        };

        if(currencyChange === 'RUB'){
            document.getElementById("monthPayment")!.textContent = `${format(Math.round(monthPayment))} RUB`;
            document.getElementById("totalSum")!.textContent = `${format(Math.round(totalCoastCredit))} RUB`;
            document.getElementById("monthPaymentCurrency")!.textContent = `${format(Math.round(monthPaymentCurrency))} ${currencyChange}`;
            document.getElementById("totalSumCurrency")!.textContent = `${format(Math.round(totalCoastCreditCurrency))} ${currencyChange}`;

        }
        else {
            document.getElementById("monthPayment")!.textContent = `${format(Math.round(convertMonthPaymentCurrency))} RUB`;
            document.getElementById("totalSum")!.textContent = `${format(Math.round(convertTotalCurrency ))} RUB`;
            document.getElementById("monthPaymentCurrency")!.textContent = `${format(Math.round(monthPayment))} ${currencyChange}`;
            document.getElementById("totalSumCurrency")!.textContent = `${format(Math.round(totalCoastCredit))} ${currencyChange}`;
        }

    } catch (error) {
        alert("Ошибка при получении валют");
        console.log(error)
    }
}







