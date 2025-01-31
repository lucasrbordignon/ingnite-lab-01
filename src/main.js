import "./css/index.css";
import Imask, { Masked } from "imask";

const ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69247"],
    default: ["black", "grey"],
  };
  ccBgColor1.setAttribute("fill", colors[type][0]);
  ccBgColor2.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

globalThis = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};

const securityCodeMasked = Imask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: Imask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: Imask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};

const expirationDateMasked = Imask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]zd{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find( function(item) {
      return number.match(item.regex)
    })
    return foundMask    
  },
}

const cardNumberMasked = Imask(cardNumber, cardNumberPattern)

const addButton = document.querySelector('#add-card')
addButton.addEventListener('click', () => {
  alert('Cartão adicionado')
})

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector('.cc-holder .value')

  ccHolder.innerText = cardHolder.value.length === 0 ? 'NOME DO TITULAR' : cardHolder.value
})

securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector('.cc-security .value')
  ccSecurity.innerText = code.length === 0 ? '123' : code
}

cardNumberMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updatecardNumber(cardNumberMasked.value)
})

function updatecardNumber(number) {
  const ccNumber = document.querySelector('.cc-number')
  ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number
}

expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector('.cc-expiration')
  ccExpiration.innerText = date.length === 0 ? '02/32' : date
}