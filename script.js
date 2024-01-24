"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const createUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((value) => value[0])
      .join("");
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accum, value) => accum + value, 0);

  labelBalance.textContent = acc.balance + " €";
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((move, index) => {
    const movementType = move > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${move}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplaySummary = function (account) {
  labelSumIn.textContent =
    account.movements
      .filter((move) => move > 0)
      .reduce((acc, deposit) => acc + deposit, 0) + " €";

  labelSumOut.textContent =
    Math.abs(
      account.movements
        .filter((value) => value < 0)
        .reduce((acc, withdraw) => acc + withdraw, 0)
    ) + " €";

  labelSumInterest.textContent =
    account.movements
      .filter((value) => value > 0)
      .map((deposit) => (deposit * account.interestRate) / 100)
      .filter((value) => value > 1)
      .reduce((acc, value) => acc + value, 0) + " €";
};

const updatUI = function (account) {
  calcDisplayBalance(account);
  displayMovements(account);
  calcDisplaySummary(account);
};

createUserName(accounts);

// Event handlers

let activeAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  activeAccount = accounts.find(
    (value) => value.username == inputLoginUsername.value
  );

  if (activeAccount?.pin == inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();
    containerApp.style.opacity = 100;

    labelWelcome.textContent = `Welcome back, ${
      activeAccount.owner.split(" ")[0]
    }`;

    updatUI(activeAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const receiver = accounts.find(
    (value) => value.username == inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  if (
    amount > 0 &&
    activeAccount.balance >= amount &&
    receiver &&
    receiver?.username !== activeAccount.username
  ) {
    inputTransferTo.value = inputTransferAmount.value = "";
    activeAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updatUI(activeAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  if (
    amount > 0 &&
    activeAccount.movements.some((value) => value >= amount * 0.1)
  ) {
    inputLoanAmount.value = "";
    activeAccount.movements.push(amount);
    updatUI(activeAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === activeAccount.username &&
    inputClosePin.value == activeAccount.pin
  ) {
    const indexToDelete = accounts.findIndex(
      (value) => (value.username = activeAccount.username)
    );
    accounts.splice(indexToDelete, 1);
    inputCloseUsername.value = inputClosePin.value = "";
    containerApp.style.opacity = 0;
  }
});

let isSort = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  isSort = !isSort;
  displayMovements(activeAccount, isSort);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const totalDeposits = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((acc, value) => acc + value, 0);

const depositMoreThan1000 = accounts
  .flatMap((acc) => acc.movements)
  .filter((move) => move >= 1000)
  .reduce((acc, _) => ++acc, 0);

const depositMoreThan10002 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, value) => (value >= 1000 ? ++acc : acc), 0);

const totalDepositsAndWithdrawel = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (acc, cur) => {
      // cur > 0 ? (acc.deposit += cur) : (acc.withdrawal += cur);
      acc[cur > 0 ? "deposit" : "withdrawal"] += cur;
      return acc;
    },
    { deposit: 0, withdrawal: 0 }
  );

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

dogs.forEach((value) => {
  return (value.recommendedFood = value.weight ** 0.75 * 28);
});

const sarahDog = dogs.find((value) => value.owners.includes("Sarah"));
console.log(
  sarahDog.curFood > sarahDog.recommendedFood * 0.9 &&
    sarahDog.curFood < sarahDog.recommendedFood * 1.1
);

const ownersEatTooMuch = dogs
  .filter((dog) => {
    return (
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
    );
  })
  .flatMap((value) => value.owners);

const ownersEatTooLittle = dogs
  .filter((dog) => {
    return !(
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
    );
  })
  .flatMap((value) => value.owners);

const { ownersEatTooMuch1, ownersEatTooLittle1 } = dogs.reduce(
  (acc, dog) => {
    if (
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
    ) {
      acc.ownersEatTooMuch1.push(dog.owners);
    } else {
      acc.ownersEatTooLittle1.push(dog.owners);
    }
    return acc;
  },
  {
    ownersEatTooMuch1: [],
    ownersEatTooLittle1: [],
  }
);

console.log(ownersEatTooMuch.join(" "));
console.log(ownersEatTooLittle.join(" "));
