import axios from 'axios';
import { useEffect, useState } from 'react'
import './App.css';
import CurrencyRow from './CurrencyRow';
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';
const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    axios.get(BASE_URL, {
      method: 'GET',
      headers: {
        apikey: API_KEY
      }
    })
      .then(res => {
        const firstCurrency = Object.keys(res.data.data)[0]
        setCurrencyOptions([...Object.keys(res.data.data)])
        setToCurrency(firstCurrency)
        setExchangeRate(res.data.data[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      axios.get(BASE_URL, {
        method: 'GET',
        headers: {
          apikey: API_KEY
        },
        params: {
          base_currency: fromCurrency
        }
      })
        .then(res => {
          setExchangeRate(res.data.data[toCurrency])
        })
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
