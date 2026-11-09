// 現在表示している日付
let currentDate = new Date();

// 日付URLを取得する
const params = new URLSearchParams(location.search);
const dateParam = params.get("date");
if (dateParam) {
    const parts = dateParam.split("-");
    currentDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

// 日付を「2026-08-28」の形にする
function getDateKey(date) {
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
}

// 前日・次の日
function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    displayTodayDate();
    displayTodayTotal();
    displayItems();
    const key = getDateKey(currentDate);
    if (memoHistory[key]) {
        document.getElementById("memo-area").value = memoHistory[key];
    } else { document.getElementById("memo-area").value = ""; }
}

// 全日付のデータを取得
let savingsHistory = JSON.parse(localStorage.getItem("savingsHistory")) || {};
let memoHistory = JSON.parse(localStorage.getItem("memoHistory")) || {};

// 現在の日付がなければ作る
const currentKey = getDateKey(currentDate);
if (!savingsHistory[currentKey]) { savingsHistory[currentKey] = []; }

// 日付を表示
function displayTodayDate() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const week = ["日", "月", "火", "水", "木", "金", "土"];
    document.getElementById("todayDate").textContent = `${year}年${month}月${day}日（${week[currentDate.getDay()]}）`;
}

// 現在の日付の合計金額を計算
function getTodayTotal() {
    const todayKey = getDateKey(currentDate);
    let total = 0;
    const items = savingsHistory[todayKey] || [];
    items.forEach(function (item) { total += item.amount; });
    return total;
}

// 合計金額を表示
function displayTodayTotal() {
    const total = getTodayTotal();
    document.getElementById("todayTotal").textContent = total + "円";
}

// データを保存
function saveData() {
    localStorage.setItem("savingsHistory", JSON.stringify(savingsHistory));
}

// 貯金額を追加
function addMoney(amount, itemName) {
    const todayKey = getDateKey(currentDate);
    if (!savingsHistory[todayKey]) { savingsHistory[todayKey] = []; }
    savingsHistory[todayKey].push({
        name: itemName,
        amount: amount
    });
    displayTodayTotal();
    displayItems();
    saveData();
}

// 眠れません配信用ボタン
function addNemurenai() {
    const todayKey = getDateKey(currentDate);
    if (!savingsHistory[todayKey]) { savingsHistory[todayKey] = []; }
    // その日の「眠れません配信」の回数を数える
    const count = savingsHistory[todayKey].filter(function (item) {
        return item.name === "眠れません配信";
    }).length;
    // 1回目は1000円、2回目以降は500円
    const amount = count === 0 ? 1000 : 500;
    savingsHistory[todayKey].push({
        name: "眠れません配信",
        amount: amount
    });
    displayTodayTotal();
    displayItems();
    saveData();
}

// その他の入力
function addOtherMoney() {
    const amount = Number(document.getElementById("otherAmount").value);
    const memo = document.getElementById("otherMemo").value;
    if (amount <= 0) {
        alert("金額を入力してください");
        return;
    }
    if (memo === "") {
        alert("その他の内容を入力してください");
        return;
    }
    const todayKey = getDateKey(currentDate);
    if (!savingsHistory[todayKey]) { savingsHistory[todayKey] = []; }
    savingsHistory[todayKey].push({
        name: "その他",
        amount: amount,
        memo: memo
    });
    displayTodayTotal();
    displayItems();
    saveData();
    document.getElementById("otherAmount").value = "";
    document.getElementById("otherMemo").value = "";
}

// メモの保存
function saveMemo() {
    const memo = document.getElementById("memo-area").value;
    const todayKey = getDateKey(currentDate);
    memoHistory[todayKey] = memo;
    localStorage.setItem("memoHistory", JSON.stringify(memoHistory));
    alert("メモを保存しました");
}

// 現在の日付の明細を表示
function displayItems() {
    const list = document.getElementById("todayItems");
    list.innerHTML = "";
    const todayKey = getDateKey(currentDate);
    const items = savingsHistory[todayKey] || [];
    items.forEach(function (item, index) {
        const li = document.createElement("li");
        li.textContent = (item.memo || item.name) + "：" + item.amount + "円";
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "取り消し";
        deleteButton.onclick = function () { removeItem(index); };
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

// 明細を削除
function removeItem(index) {
    const todayKey = getDateKey(currentDate);
    savingsHistory[todayKey].splice(index, 1);
    displayTodayTotal();
    displayItems();
    saveData();
}

// 現在の日付の貯金をリセット
function resetToday() {
    const todayKey = getDateKey(currentDate);
    savingsHistory[todayKey] = [];
    displayTodayTotal();
    displayItems();
    saveData();
}

// 最初に表示
displayTodayDate();
displayTodayTotal();
displayItems();

// メモの復元
const memoKey = getDateKey(currentDate);
if (memoHistory[memoKey]) {
    document.getElementById("memo-area").value = memoHistory[memoKey];
}