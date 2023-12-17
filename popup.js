// 一覧を取得
const tabs = await chrome.tabs.query({
  url: ["*://*/*"],
});
const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
  // コピーして新規のテンプレを用意する
  const element = template.content.firstElementChild.cloneNode(true);
  // タイトルとパスを記述する
  const title = tab.title.split("-")[0].trim();
  // const pathname = new URL(tab.url).pathname;
  const pathname = new URL(tab.url);
  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  // リンクを押したときの動作を仕込む
  element.querySelector("a").addEventListener("click", async () => {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });
  elements.add(element);
}

document.querySelector("ul").append(...elements);
const button = document.querySelector("button");

// 検索
button.addEventListener("click", async () => {
  const searchText = document.getElementById("search").value;

  // 配列
  const url = [];
  for (const tab of tabs) {
    // 部分一致でタイトルを検索,一致したらURLを配列に格納
    if (tab.title.includes(searchText)) {
      url.push(tab.url);
    }
  }
  const searchTabs = await chrome.tabs.query({
    url: url,
  });
  const template = document.getElementById("li_template");
  // ulを空にする
  document.querySelector("ul").innerHTML = "";
  const elements = new Set();
  for (const tab of searchTabs) {
    console.log(tabs);
    // コピーして新規のテンプレを用意する
    const element = template.content.firstElementChild.cloneNode(true);
    // タイトルとパスを記述する
    const title = tab.title.split("-")[0].trim();
    const pathname = new URL(tab.url).pathname;
    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    // リンクを押したときの動作を仕込む
    element.querySelector("a").addEventListener("click", async () => {
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
    });
    elements.add(element);
  }
  document.querySelector("ul").append(...elements);
});
