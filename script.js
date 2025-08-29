const balanceToDisplay = document.querySelector(".balance-amount");
const incomeToDisplay = document.querySelector(".income-amount");
const expenseToDisplay = document.querySelector(".expense-amount");
const parentList = document.querySelector(".parent-li");
const select = document.querySelector("#category");
const search = document.querySelector("#search");
const searchBtn = document.querySelector(".search-icon");
const form = document.querySelector(".form");
const input = document.querySelector("#inputTodo");
const button = document.querySelector("#addToList");
const container = document.querySelector(".todo-container");
const tBody = document.querySelector('#tableBody');
const menuOpenButton = document.querySelector(".header-open-btn");
const menuCloseButton = document.querySelector(".header-close-btn");
const navbarItems = document.querySelector('.navbar-items');
const navLinks = document.querySelectorAll(".navbar-items a");

let transactions = [];
//render items on ui
const renderList = (filter = "all") => {
  parentList.innerHTML = "";
  transactions = JSON.parse(localStorage.getItem("formData")) || [];
  transactions.forEach((elem) => {
    const title = elem.title.toLowerCase();
    const category = elem.category.toLowerCase();
    // Partial matching for search OR exact category filtering
    if (
      filter !== "all" &&
      !title.includes(filter) &&
      !category.includes(filter)
    ) {
      return; // Skip if it doesn't match
    }

    const li = document.createElement("li");
    li.classList.add("list-item");

    // for list icons more will be add later
    let icon = "";
switch (elem.category.toLowerCase()) {
  case "food":
    icon = '<i class="fa-solid fa-bowl-food"></i>';
    break;
  case "salary":
    icon = '<i class="fa-solid fa-sack-dollar"></i>';
    break;
  case "uber":
    icon = '<i class="fa-solid fa-taxi"></i>';
    break;
  case "bills":
    icon = '<i class="fa-solid fa-file-invoice"></i>';
    break;
  case "rent":
    icon = '<i class="fa-solid fa-house-chimney"></i>';
    break;
  case "petrol":
    icon = '<i class="fa-solid fa-gas-pump"></i>';
    break;
  case "groceries":
    icon = '<i class="fa-solid fa-cart-shopping"></i>';
    break;
   case "date":
    icon = '<i class="fa-solid fa-calendar-days"></i>';
    break;
  default:
    icon = '<i class="fa-solid fa-circle-question"></i>';
    break;
}

   li.innerHTML = `
  <div class="li-div">
    <div class="categ">
      <div class="categ-icon">${icon}</div>
      <div class="categ-info">
        <h2 id="categ-title">
          ${elem.title.length >= 10 ? elem.title.slice(0, 10)+'...' : elem.title}
        </h2>
        <p id="categ-category">${elem.category}</p>
      </div>
    </div>
    <div class=${
      elem.category.toLowerCase() === "salary"
        ? "money-spend-receive-salary"
        : "money-spend-receive"
    }>
      <p class="money-spend-receive-value">
        <span class="sign">${
          elem.category.toLowerCase() === "salary" ? "+" : "-"
        }</span>
         &#8377; <span class="value">${elem.amount}</span>
      </p>
    </div>

    <!-- Hidden hover info -->
    <div class="hover-details">
      <p><i class="fa-solid fa-calendar-days"></i> ${elem.date || "No Date"}</p>
      <p>${icon} ${elem.title || "Not Specified"}</p>
    </div>
  </div>
`;
    parentList.append(li);
  });
};

// update the data
const dataUpdate = () => {
  transactions = JSON.parse(localStorage.getItem("formData")) || [];
  let income = 0;
  let expense = 0;
  let balance = 0;
  transactions.forEach(({ amount, category }) => {
    const amt = Number(amount);
    if (category.toLowerCase() === "salary") {
      income += amt;
    } else {
      expense += amt;
    }
  });
  balance = income - expense;
  console.log("income", income);
  console.log("expense", expense);
  console.log("balance", balance);
  balanceToDisplay.innerHTML = ` &#8377; ${balance}`;
  incomeToDisplay.innerHTML = ` &#8377; ${income}`;
  expenseToDisplay.innerHTML = ` &#8377; ${expense}`;
};

//form handling
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  console.log(formData);

  const title = formData.get("title").replace(/\s+/g, " ").trim();
  const amount = formData.get("amount").replace(/\s+/g, " ").trim();
  const category = formData.get("category");
  const payment = formData.get("payment");
  const date = formData.get("date");
  const notes = formData.get("notes").replace(/\s+/g, " ").trim();
  const data = { title, amount, category, payment, date, notes };

  transactions.push(data);
  localStorage.setItem("formData", JSON.stringify(transactions));
  console.log(transactions);
  form.reset();
  alert("data submitted");

  dataUpdate(); // Updates balance
  renderList("all"); // Updates transaction list
  renderChart(); // Updates chart dynamically
  showTable();//update data table
});

//filter functionality
select.addEventListener("change", (e) => {
  const selectedFilter = e.target.value.toLowerCase()
  // console.log(e.target.value)
  transactions = JSON.parse(localStorage.getItem("formData")) || [];
  renderList(selectedFilter);
});

//search functionality
search.addEventListener("input", (e) => {
  const value = e.target.value;
  // console.log(e)
  console.log(value);
});
searchBtn.addEventListener("click", () => {
  const value = search.value.trim().toLowerCase();
  // console.log(search.value)
  renderList(value);
  search.value = "";
});

dataUpdate();
renderList("all");

// Chart
const ctx = document.getElementById("myChart");
let myChart;

// List of categories to track
const categories = ["salary", "food", "uber", "bill","rent","petrol","groceries", "other"];

// Function to calculate totals for each category
function calculateCategoryTotals() {
  const totals = {};
  categories.forEach((cat) => (totals[cat] = 0));

  transactions.forEach((elem) => {
    const amount = Number(elem.amount);
    const category = elem.category.toLowerCase();
    if (totals.hasOwnProperty(category)) {
      totals[category] += amount;
    } else {
      totals.other += amount; // For unexpected categories 
    }
  });

  return categories.map((cat) => totals[cat]);
}

// Render or Update Chart Dynamically
function renderChart() {
  const chartData = calculateCategoryTotals();

  if (myChart) {
    // Update existing chart
    myChart.data.datasets[0].data = chartData;
    myChart.update();
    return;
  }

  // Create chart first time
  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["salary", "food", "uber", "bill","rent","petrol","groceries", "other"],
      datasets: [
        {
          label: "Expense Breakdown",
          data: chartData,
          backgroundColor: [
            "#36A2EB",
            "#FF6384",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#2c3838",
            "#2a4272",
          ],
          borderWidth: 2,
          hoverOffset: 12,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { size: 14, weight: "bold" },
            color: "#333",
          },
        },
        tooltip: {
          backgroundColor: "#222",
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  });
}

//todos
let data = [];
// Adding Data to localStorage
const addToLocal = (newData) => {
  localStorage.setItem("data", JSON.stringify(newData));
};

// check for optimization + add data to array and localStorage
const check = (inputValue) => {
  if (!data.includes(inputValue) && inputValue !== "") {
    data.push(inputValue);
    addToLocal(data);
    return true;
  }
  // console.log(data);
  return false;
};

// creating todo items
const create = (inputValue) => {
  if (!check(inputValue)) return;

  const li = document.createElement("li");
  li.classList.add("todo-li");

  const p = document.createElement("p");
  p.innerText = inputValue;

  const delBtn = document.createElement("button");
  delBtn.classList.add("deleteBtn");
  delBtn.innerText = "Delete";

  li.append(p, delBtn);
  container.append(li);
};

//i add event delegation here
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const li = e.target.parentElement;
    const itemText = li.querySelector("p").innerText;
    //remove from ui
    li.remove();
    //remove from localStorage
    data = data.filter((item) => item !== itemText);
    if (data.length > 0) {
      addToLocal(data);
    } else {
      localStorage.removeItem("data");
    }
  }
});

// showing data on loading of page everytime
const showOnLoad = () => {
  const storedData = JSON.parse(localStorage.getItem("data")) || [];
  data = storedData; // <-- important to keep `data` in sync

  container.innerHTML = "";
  // console.log(storedData);
  storedData.forEach((elem) => {
    const li = document.createElement("li");
    li.classList.add("todo-li");

    const p = document.createElement("p");
    p.innerText = elem;

    const delBtn = document.createElement("button");
    delBtn.classList.add("deleteBtn");
    delBtn.innerText = "Delete";

    li.append(p, delBtn);
    container.append(li);
  });
  // console.log(storedData)
};
// handling user input
const handleInput = () => {
  let inputValue = input.value.trim().replace(/\s+/g, " ");
  // console.log(inputValue);
  create(inputValue);
  input.value = "";
};

//handling events
button.addEventListener("click", (e) => {
  e.preventDefault();
  handleInput();
});
button.addEventListener("keydown", (e) => {
  if ((e.key = "Enter")) {
    e.preventDefault();
    handleInput();
  }
});

//table
const showTable = ()=>{
    tBody.innerHTML=''
    transactions = JSON.parse(localStorage.getItem('formData')) || []
    transactions.forEach((item)=>{
      const tr = document.createElement('tr')
      for(let key in item){
          const td = document.createElement('td')
          const value = item[key]
          td.innerText = value
          tr.append(td)
      }
      tBody.append(tr)
    })
}
//styling
document.addEventListener("DOMContentLoaded", () => {
  dataUpdate(); // Updates balance
  renderList("all"); // Updates transaction list
  renderChart(); // Updates chart dynamically
  showOnLoad();
  showTable();
  // localStorage.removeItem('formData')
  const main = document.querySelector("main");

  if (main) {
    // Apply scroll-reveal class to all children inside <main>
    main.querySelectorAll("*").forEach((el) => {
      el.classList.add("scroll-reveal");
    });

    // Observer setup to animate elements only once
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe every .scroll-reveal element
    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => observer.observe(el));
  }
});

menuOpenButton.addEventListener("click", () => {
  navbarItems.classList.toggle("active");
});
menuCloseButton.addEventListener("click", () => {
  navbarItems.classList.remove('active')
})
navLinks.forEach((link)=>{
  link.addEventListener('click',()=>{
    navbarItems.classList.remove('active')
  })
})
