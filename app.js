document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.querySelector('input[type="text"]');
    const fromSelect = document.querySelector('select[name="from"]');
    const toSelect = document.querySelector('select[name="to"]');
    const dropdowns = document.querySelectorAll(".dropdown select");
    const msgDiv = document.querySelector('.msg');
    const button = document.querySelector('button');
  
    // Example countryList object; replace with your actual data
    // const countryList = {
    //   "USD": "United States Dollar",
    //   "EUR": "Euro",
    //   "GBP": "British Pound",
    //   "JPY": "Japanese Yen",
    //   // Add other currencies as needed
    // };
  
    // Populate dropdowns with currency codes
    function populateDropdowns() {
      for (let select of dropdowns) {
        select.innerHTML = ''; // Clear existing options
        for (let currCode in countryList) {
          let newOption = document.createElement("option");
          newOption.innerText = currCode;
          newOption.value = currCode;
          select.append(newOption);
        }
      }
    }
  
    populateDropdowns();
  
    button.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent form submission
  
      const amount = parseFloat(amountInput.value);
      const fromCurrency = fromSelect.value;
      const toCurrency = toSelect.value;
  
      if (isNaN(amount) || amount <= 0) {
        msgDiv.textContent = 'Please enter a valid amount.';
        return;
      }
  
      try {
        // Fetch exchange rates from the API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        const rates = data.rates;
  
        // Convert amount
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        if (fromRate && toRate) {
          const convertedAmount = (amount / fromRate) * toRate;
          msgDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        } else {
          msgDiv.textContent = 'Invalid currency code.';
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        msgDiv.textContent = 'Error fetching exchange rates.';
      }
    });
  });
  