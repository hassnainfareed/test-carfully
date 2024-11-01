var voucher_codes = require("voucher-code-generator");

const code = voucher_codes.generate({
  length: 64,
  count: 3,
  charset: voucher_codes.charset("alphabetic"),
});

console.log(code);

// 2

var totalPrice = 2000;

console.log(totalPrice.toFixed(2).toString());
