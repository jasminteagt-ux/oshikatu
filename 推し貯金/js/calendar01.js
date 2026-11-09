let currentDate = new Date();
const calendarDays = document.getElementById("calendar-days");
const currentMonth = document.getElementById("current-month");

// 保存されている貯金データを取得
let savingsHistory = JSON.parse(localStorage.getItem("savingsHistory")) || {};
let memoHistory = JSON.parse(localStorage.getItem("memoHistory")) || {};

// カレンダーを作る
function createCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // カレンダーの日付を一度全部消す
    calendarDays.innerHTML = "";
    // 月のタイトル
    currentMonth.textContent = `${year}年${month + 1}月`;
    // 月の1日
    const firstDay = new Date(year, month, 1);
    // 1日の曜日
    const dayOfWeek = firstDay.getDay();
    // 月の最終日
    const lastDay = new Date(year, month + 1, 0);
    // 月の日数
    const daysInMonth = lastDay.getDate();
    // 最初の空白
    for (let i = 0; i < dayOfWeek; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.textContent = "";
        calendarDays.appendChild(emptyDay);
    }
    // 日付を作る
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        // 日付
        const dayNumber = document.createElement("div");
        dayNumber.textContent = day;
        // 日付を「2026-08-26」の形にする
        const dateKey =
            year + "-" +
            String(month + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");
        // その日の合計
        const total = getDayTotal(dateKey);
        // 金額を表示
        const moneyElement = document.createElement("div");
        moneyElement.textContent = total + "円";
        // 日付と金額を追加
        dayElement.appendChild(dayNumber);
        dayElement.appendChild(moneyElement);
        // その日の貯金データ
        const items = savingsHistory[dateKey] || [];
        // 配信・動画・ショートのアイコン
        const hasDouga = items.some(function (item) { return item.name === "配信・動画・ショート"; });
        if (hasDouga) {
            const icon = document.createElement("img");
            icon.src = "img/doga.png";
            icon.alt = "配信・動画・ショート";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // ストグラ配信のアイコン
        const hasSutogura = items.some(function (item) { return item.name === "ストグラ"; });
        if (hasSutogura) {
            const icon = document.createElement("img");
            icon.src = "img/STGR2.png";
            icon.alt = "ストグラ";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // メン限配信のアイコン
        const hasMengen = items.some(function (item) { return item.name === "メン限"; });
        if (hasMengen) {
            const icon = document.createElement("img");
            icon.src = "img/mengen.png";
            icon.alt = "メン限";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // 眠れません配信のアイコン
        const hasNemurenai = items.some(function (item) { return item.name === "眠れません配信"; });
        if (hasNemurenai) {
            const icon = document.createElement("img");
            icon.src = "img/nemuranai.png";
            icon.alt = "眠れません配信";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // コラボのアイコン
        const hasKorabo = items.some(function (item) { return item.name === "コラボ"; });
        if (hasKorabo) {
            const icon = document.createElement("img");
            icon.src = "img/collabo.png";
            icon.alt = "コラボ";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // コラボ（自枠なし）のアイコン
        const hasKorabo2 = items.some(function (item) { return item.name === "コラボ（自枠なし）"; });
        if (hasKorabo2) {
            const icon = document.createElement("img");
            icon.src = "img/collabo2.png";
            icon.alt = "コラボ（自枠なし）";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // 案件のアイコン
        const hasAnken = items.some(function (item) { return item.name === "案件"; });
        if (hasAnken) {
            const icon = document.createElement("img");
            icon.src = "img/Anken.png";
            icon.alt = "案件";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // グッズ販売のアイコン
        const hasGoods = items.some(function (item) { return item.name === "グッズ販売"; });
        if (hasGoods) {
            const icon = document.createElement("img");
            icon.src = "img/Goods.png";
            icon.alt = "グッズ販売";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // リアイベのアイコン
        const hasRiaive = items.some(function (item) { return item.name === "リアイベ"; });
        if (hasRiaive) {
            const icon = document.createElement("img");
            icon.src = "img/riaibe.png";
            icon.alt = "リアイベ";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // その他のアイコン
        const hasSonota = items.some(function (item) { return item.name === "その他"; });
        if (hasSonota) {
            const icon = document.createElement("img");
            icon.src = "img/Other.png";
            icon.alt = "その他";
            icon.className = "calendar-icon";
            dayElement.appendChild(icon);
        }
        // メモがある日のアイコン
        const hasMemo = memoHistory[dateKey] && memoHistory[dateKey].trim() !== "";
        if (hasMemo) {
            const memoIcon = document.createElement("img");
            memoIcon.src = "img/Memo.png";
            memoIcon.alt = "メモあり";
            memoIcon.className = "calendar-memo-icon";
            memoIcon.title = "メモあり";
            dayElement.appendChild(memoIcon);
        }
        // クリックしたとき
        dayElement.addEventListener("click", function () { showDetails(dateKey); });
        calendarDays.appendChild(dayElement);
    }
    // 月の合計を表示
    displayMonthlyTotal(year, month);
}

// 指定した日の合計を取得
function getDayTotal(dateKey) {
    let total = 0;
    const items = savingsHistory[dateKey] || [];
    items.forEach(function (item) { total += item.amount; });
    return total;
}

// 日付をクリックしたとき
function showDetails(dateKey) {
    const details = document.getElementById("details");
    const selectedDate = document.getElementById("selected-date");
    const selectedTotal = document.getElementById("selected-total");
    const selectedMemo = document.getElementById("selected-memo");
    // 表示を一度消す
    details.innerHTML = "";
    // 日付を表示
    selectedDate.textContent = dateKey + "の明細";
    const items = savingsHistory[dateKey] || [];
    let total = 0;
    if (items.length === 0) {
        const li = document.createElement("li");
        li.textContent = "この日の貯金はありません。";
        details.appendChild(li);
    } else {
        items.forEach(function (item) {
            const li = document.createElement("li");
            li.textContent = item.name + "：" + item.amount + "円";
            details.appendChild(li);
            total += item.amount;
        });
    }
    selectedTotal.textContent = total;
    const memo = memoHistory[dateKey] || "メモはありません。";
    selectedMemo.textContent = memo;
    const editButton = document.createElement("button");
    editButton.textContent = "修正";
    editButton.onclick = function () { location.href = "today.html?date=" + dateKey; };
    document.getElementById("selected-date").appendChild(editButton);
}

// 月の合計
function displayMonthlyTotal(year, month) {
    let total = 0;
    for (let dateKey in savingsHistory) {
        // 例：2026-08-26 → 2026-08
        const targetMonth =
            year + "-" +
            String(month + 1).padStart(2, "0");
        if (dateKey.startsWith(targetMonth)) { total += getDayTotal(dateKey); }
    }
    document.getElementById("monthly-total").textContent = total;
}

// 最初にカレンダーを表示
createCalendar();

// 次の月
const nextMonth =
    document.getElementById("next-month");
nextMonth.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    createCalendar();
});

// 前の月
const prevMonth =
    document.getElementById("prev-month");
prevMonth.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    createCalendar();
});