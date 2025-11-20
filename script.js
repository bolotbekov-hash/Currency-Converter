const elements = {
            amount: document.getElementById('amount'),
            fromCurrency: document.getElementById('fromCurrency'),
            toCurrency: document.getElementById('toCurrency'),
            convertBtn: document.getElementById('convertBtn'),
            swapBtn: document.getElementById('swapBtn'),
            result: document.getElementById('result'),
            resultAmount: document.getElementById('resultAmount'),
            exchangeRate: document.getElementById('exchangeRate'),
            error: document.getElementById('error')
        };

        async function fetchRate(from, to) {
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
            if (!res.ok) throw new Error('Failed to fetch rate');
            const data = await res.json();
            return data.rates[to];
        }

        function showError(msg) {
            elements.error.textContent = msg;
            elements.result.classList.remove('show');
        }

        function hideError() {
            elements.error.textContent = '';
        }

        async function convert() {
            hideError();
            
            const amount = parseFloat(elements.amount.value);
            if (isNaN(amount) || amount <= 0) {
                showError('Please enter a valid amount');
                return;
            }

            const from = elements.fromCurrency.value;
            const to = elements.toCurrency.value;

            try {
                const rate = await fetchRate(from, to);
                const converted = (amount * rate).toFixed(2);
                
                elements.resultAmount.textContent = `${converted} ${to}`;
                elements.exchangeRate.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
                elements.result.classList.add('show');
            } catch (err) {
                showError('Failed to fetch exchange rates');
            }
        }

        function swap() {
            [elements.fromCurrency.value, elements.toCurrency.value] = 
            [elements.toCurrency.value, elements.fromCurrency.value];
            
            if (elements.result.classList.contains('show')) {
                convert();
            }
        }

        elements.convertBtn.addEventListener('click', convert);
        elements.swapBtn.addEventListener('click', swap);
        elements.amount.addEventListener('keypress', e => {
            if (e.key === 'Enter') convert();
        });
        elements.fromCurrency.addEventListener('change', () => {
            if (elements.result.classList.contains('show')) convert();
        });
        elements.toCurrency.addEventListener('change', () => {
            if (elements.result.classList.contains('show')) convert();
        });