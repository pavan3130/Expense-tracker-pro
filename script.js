window.onload = function() {
    // DOM Elements
    const balanceEl = document.getElementById("balance");
    const incomeEl = document.getElementById("income");
    const expenseEl = document.getElementById("expense");
    const descInput = document.getElementById("desc");
    const amountInput = document.getElementById("amount");
    const typeSelect = document.getElementById("type");
    const categorySelect = document.getElementById("category");
    const addBtn = document.getElementById("addBtn");
    const transactionsList = document.getElementById("transactionsList");

    // Load transactions
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Chart.js setup
    const categoryCtx = document.getElementById("categoryChart").getContext("2d");
    const monthlyCtx = document.getElementById("monthlyChart").getContext("2d");

    let categoryChart = new Chart(categoryCtx,{
        type:'pie',
        data:{
            labels: ['general','food','transport','shopping','salary','other'],
            datasets:[{data:[0,0,0,0,0,0], backgroundColor:['#6c5ce7','#00b894','#fd79a8','#e17055','#00cec9','#fdcb6e'] }]
        },
        options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } }
    });

    let monthlyChart = new Chart(monthlyCtx,{
        type:'bar',
        data:{ 
            labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets:[
                { label:'Income', data: Array(12).fill(0), backgroundColor:'#28a745' },
                { label:'Expense', data: Array(12).fill(0), backgroundColor:'#dc3545' }
            ]
        },
        options:{ responsive:true, scales:{ y:{ beginAtZero:true } } }
    });

    // Update display & charts
    function updateDisplay(){
        let income=0, expense=0;
        transactionsList.innerHTML="";

        // Category totals
        const categoryTotals = {general:0, food:0, transport:0, shopping:0, salary:0, other:0};
        const monthlyTotals = {income: Array(12).fill(0), expense: Array(12).fill(0)};

        transactions.forEach((t,index)=>{
            // Transaction list
            const li=document.createElement("li");
            li.classList.add("transaction-item",t.type);
            li.innerHTML=`${t.desc} (${t.category}) - ₹${t.amount} <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>`;
            transactionsList.appendChild(li);

            if(t.type==='income') income+=t.amount; else expense+=t.amount;
            categoryTotals[t.category]+=t.amount;

            const month=new Date(t.date).getMonth();
            monthlyTotals[t.type][month]+=t.amount;
        });

        balanceEl.textContent=(income-expense).toFixed(2);
        incomeEl.textContent=income.toFixed(2);
        expenseEl.textContent=expense.toFixed(2);

        categoryChart.data.datasets[0].data=Object.values(categoryTotals);
        categoryChart.update();

        monthlyChart.data.datasets[0].data=monthlyTotals['income'];
        monthlyChart.data.datasets[1].data=monthlyTotals['expense'];
        monthlyChart.update();

        localStorage.setItem("transactions",JSON.stringify(transactions));
    }

    // Add transaction
    function addTransaction(){
        const desc=descInput.value.trim();
        const amount=parseFloat(amountInput.value);
        const type=typeSelect.value;
        const category=categorySelect.value;
        const date=new Date().toISOString();

        if(!desc || isNaN(amount)){ alert("Enter valid description and amount"); return; }

        transactions.push({desc,amount,type,category,date});
        descInput.value=""; amountInput.value=""; categorySelect.value="general";
        updateDisplay();
    }

    // Delete transaction
    window.deleteTransaction = function(index){
        transactions.splice(index,1);
        updateDisplay();
    }

    addBtn.addEventListener("click", addTransaction);
    updateDisplay();
}
