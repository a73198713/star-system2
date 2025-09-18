// 季節の作物プルダウン更新
function updateCropOptions() {
  const season = document.getElementById("season").value;
  const cropSelect = document.getElementById("crop");
  cropSelect.innerHTML = "";

  if (crops[season]) {
    crops[season].forEach(crop => {
      const option = document.createElement("option");
      option.value = crop.name;
      option.textContent = crop.name;
      cropSelect.appendChild(option);
    });
  }
}

// 肥料プルダウン更新
function updateFertilizerOptions() {
  const fertilizerSelect = document.getElementById("fertilizer");
  fertilizerSelect.innerHTML = "";

  fertilizers.forEach(f => {
    const option = document.createElement("option");
    option.value = f.name;       // valueを肥料名と一致
    option.textContent = f.name;
    fertilizerSelect.appendChild(option);
  });
}

// 日付プルダウン更新
function updateDayOptions() {
  const daySelect = document.getElementById("day");
  daySelect.innerHTML = "";

  for (let i = 1; i <= 28; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i}日`;
    daySelect.appendChild(option);
  }
}

// main.js の calculate() をこれに置き換えてください
window.calculate = function() {
  const season = document.getElementById("season").value;
  const cropName = document.getElementById("crop").value;
  const fertilizerName = document.getElementById("fertilizer").value;
  const plantDay = parseInt(document.getElementById("day").value, 10);

  const crop = crops[season].find(c => c.name === cropName);
  const fertilizer = fertilizers.find(f => f.name === fertilizerName);

  if (!crop || !fertilizer) {
    document.getElementById("result").textContent = "データが見つかりません。";
    return;
  }

  const baseDays = crop.days;
  const speedMultiplier = fertilizer.speed;

  // 成長日数の計算（小数点切り上げ方式）
  const reduced = baseDays * (1 - speedMultiplier);
  const reducedRounded = Math.ceil(reduced);
  let effectiveDays = baseDays - reducedRounded;
  if (effectiveDays < 1) effectiveDays = 1;

  const harvestDays = [];
  let firstHarvest = plantDay + effectiveDays;

  if (firstHarvest <= 28) {
    harvestDays.push(firstHarvest);

    // === 再生作物の場合 ===
    if (crop.regrow) {
      let next = firstHarvest + crop.regrow;
      while (next <= 28) {
        harvestDays.push(next);
        next += crop.regrow;
      }
    }

    document.getElementById("result").textContent =
      `${crop.name} の収穫日: ${harvestDays.join("日, ")}日`;
  } else {
    document.getElementById("result").textContent =
      `${crop.name} はこの季節のうちに収穫できません。`;
  }

  // カレンダー描画（複数収穫対応）
  drawCalendar(plantDay, effectiveDays, crop.regrow, harvestDays);
};



// カレンダー描画関数
function drawCalendar(plantDay, growDays, regrow, harvestDays) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  for (let d = 1; d <= 28; d++) {
    const cell = document.createElement("div");
    cell.textContent = d;
    cell.style.display = "inline-block";
    cell.style.width = "40px";
    cell.style.height = "40px";
    cell.style.textAlign = "center";
    cell.style.verticalAlign = "middle";
    cell.style.border = "1px solid #ccc";

    if (d === plantDay) {
      cell.style.backgroundColor = "lightgreen"; // 植えた日
    }
    if (harvestDays.includes(d)) {
      cell.style.backgroundColor = "orange"; // 収穫日
    }

    calendar.appendChild(cell);
  }
}


// ページ読み込み時に初期化
window.onload = function() {
  updateCropOptions();
  updateFertilizerOptions();
  updateDayOptions();
};

