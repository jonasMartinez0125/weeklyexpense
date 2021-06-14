// selectors
const year = document.querySelector('#year');
const form = document.querySelector('#add-expense');
const expenseList = document.querySelector('#expenses ul');

// classes
// Class of the Budget
class Budget {

    constructor(budget) {
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    newExpense(expense) {
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }

    calculateRemaining() {
        const spent = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        this.remaining = this.budget - spent;
    }
}
// interface class
class UI {
    // show the budget in HTML
    insertBudget(amount) {
        const { budget, remaining } = amount;

        document.querySelector('#total').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;
    }
    // show an alert in HTML
    printAlert(message, type) {
        // create div
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('text-center', 'alert');

        if(type === 'error') {
            messageDiv.classList.add('alert-danger');
        } else {
            messageDiv.classList.add('alert-success');
        }

        // add the message
        messageDiv.textContent = message;

        // insert to HTML
        document.querySelector('.primary').insertBefore(messageDiv, form);

        // remove from HTML
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
    // show a list of the expenses
    showExpenses(expenses) {
        this.cleanHTML();

        expenses.forEach(expense => {
            const { amount, name, id } = expense;

            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;

            // add the expense HTML
            newExpense.innerHTML = `
                ${name} <span class="badge badge-primary badge-pill">Gs ${amount}</span>
            `;
            // button to deletethe expense
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'delete-expense');
            deleteBtn.innerHTML = 'Delete &times;';
            deleteBtn.onclick = () => {
                deleteExpense(id);
            };

            newExpense.appendChild(deleteBtn);
            // add to HTML
            expenseList.appendChild(newExpense);
        });
    }

    updateRemaining(remaining) {
        document.querySelector('#remaining').textContent = remaining;
    }

    checkBudget(budgetObj) {
        const { budget, remaining } = budgetObj;
        const remainingDiv = document.querySelector('.remaining');

        // check 25%
        if((budget / 4) > remaining) {
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');
        } else if((budget / 2) > remaining) {
            remainingDiv.classList.remove('alert-success');
            remainingDiv.classList.add('alert-warning');
        } else {
            remainingDiv.classList.remove('alert-danger', 'alert-warning');
            remainingDiv.classList.add('alert-success');
        }

        // if the total is cero or less
        if(remaining <= 0) {
            this.printAlert('The budget is over', 'error');
            document.querySelector('input[type="submit"]').disabled = true
            form.reset();
            return;
        }
    }

    // clean up HTML
    cleanHTML() {
        while(expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
    }
}

// instances
const ui = new UI();
let budget;

//events
addEventListeners();

// functions
function addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        askBudget();
        // print the current year
        currentYear();
    });

    form.addEventListener('submit', addExpense);
}

function askBudget() {
    const budgetUser = prompt('What is your budget?');

    if(
        budgetUser === '' ||
        budgetUser === null ||
        isNaN(budgetUser) ||
        budgetUser <= 0
    ) { 
        window.location.reload();
    }

    budget = new Budget(budgetUser);

    ui.insertBudget(budget);
}
// add one expense
function addExpense(e) {
    e.preventDefault();;

    // read form data
    const name = document.querySelector('#name').value;
    const amount = Number(document.querySelector('#amount').value);

    // validate
    if(name === '' || amount === '') {
        ui.printAlert('Both fields are required', 'error');
        return;
    } else if(amount <= 0 || isNaN(amount)) {
        ui.printAlert("the amount isn't valid", 'error');
        return;
    }

    // generate an object with the expense
    const expense = {
        name,
        amount,
        id: Date.now()
    }

    budget.newExpense(expense);
    // message
    ui.printAlert('Expense added successfuly');

    // show the expenses
    const { expenses, remaining } = budget;

    ui.insertBudget(budget);
    ui.showExpenses(expenses);
    ui.updateRemaining(remaining);
    ui.checkBudget(budget);
    // reset the form
    form.reset();
}
// delete one exprense
function deleteExpense(id) {
    budget.deleteExpense(id);
    // delete the expenses from HTML
    const { expenses, remaining } = budget;
    ui.showExpenses(expenses);

    ui.updateRemaining(remaining);

    ui.checkBudget(budget);
}

function currentYear() {
    let date = new Date();
    year.textContent = date.getFullYear();
}
