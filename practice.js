const transactions = [
  { title: "Coffee", amount: "120", category: "food", payment: "debitCard", date: "2025-08-26" },
  { title: "Salary Credit", amount: "50000", category: "salary", payment: "salary", date: "2025-08-01" },
  { title: "Uber Ride", amount: "240", category: "uber", payment: "upi", date: "2025-08-15" },
  { title: "Electricity Bill", amount: "1800", category: "bills", payment: "creditCard", date: "2025-08-12" },
  { title: "Groceries", amount: "1500", category: "food", payment: "upi", date: "2025-08-17" },
  { title: "Dinner at BBQ", amount: "950", category: "food", payment: "debitCard", date: "2025-08-19" },
  { title: "Internet Bill", amount: "900", category: "bills", payment: "upi", date: "2025-08-08" },
  { title: "Monthly Rent", amount: "12000", category: "expense", payment: "debitCard", date: "2025-08-05" },
  { title: "Freelance Payment", amount: "15000", category: "salary", payment: "upi", date: "2025-08-10" },
  { title: "Uber Ride", amount: "320", category: "uber", payment: "creditCard", date: "2025-08-21" },
  { title: "Gym Membership", amount: "2500", category: "expense", payment: "upi", date: "2025-08-02" },
  { title: "Electric Bill", amount: "2000", category: "bills", payment: "debitCard", date: "2025-08-13" },
  { title: "Weekend Pizza", amount: "450", category: "food", payment: "upi", date: "2025-08-23" },
  { title: "Car Fuel", amount: "2000", category: "expense", payment: "creditCard", date: "2025-08-09" },
  { title: "Uber Ride", amount: "180", category: "uber", payment: "upi", date: "2025-08-24" },
];

let income =0;
let expense =0;
let balance =0;

const dataUpdate = ()=>{
  //find amount and the category
  transactions.forEach(({amount,category})=>{
      const amt = Number(amount)

      if(category.toLowerCase()==='salary')
      {
        income+=amt
      }
      else{
        expense+=amt
      }
  })
  balance = income-expense
  console.log('income',income)
  console.log('expense',expense)
  console.log('balance',balance)
}


dataUpdate()