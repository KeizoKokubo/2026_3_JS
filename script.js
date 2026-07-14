const students = [
  { number: "01", name: "浅野 謙信", works: [{ title: "MAZE SHIFT", href: "01浅野謙信/index.html" }] },
  { number: "02", name: "石田 竜雅", works: [{ title: "2DFighters", href: "02_石田竜雅/index.html" }] },
  { number: "04", name: "岩附 龍征", works: [{ title: "METALSONIC", href: "04岩附龍征/index.html" }] },
  { number: "05", name: "植竹 智之", works: [{ title: "迷路ゲーム", href: "05_植竹智之/readme.html" }] },
  { number: "06", name: "内海 俊", works: [{ title: "JavaScript作品", href: "https://kai-sik.github.io/JavaScript/" }] },
  { number: "08", name: "岸川 颯汰", works: [{ title: "2Dブラックジャック", href: "08_岸川颯汰/index.html" }] },
  { number: "11", name: "加藤 岳人", works: [{ title: "HTML Tools", href: "11_加藤岳人/提出.html" }] },
  { number: "12", name: "川田 祥也", works: [{ title: "そろばん練習ツール", href: "https://tendonman1010.github.io/TestOnlineTool_Soroban/" }] },
  { number: "13", name: "菊地 亮太", works: [{ title: "数学パズル・デュエル", href: "13_菊地亮太/index.html" }] },
  { number: "16", name: "久木 瑞貴", works: [{ title: "TETRIS", href: "16_久木瑞貴/index.html" }] },
  { number: "17", name: "小泉 虎郁人", works: [{ title: "WEAPON BATTLE", href: "17_小泉虎郁人/index.html" }] },
  { number: "19", name: "齋藤 紡葵", works: [{ title: "Rhythm Mage Battle", href: "19_齋藤紡葵/index.html" }] },
  { number: "20", name: "佐藤 瑠乃", works: [
    { title: "ブロック崩し", href: "20_佐藤瑠乃/BlockBreak/index.html" },
    { title: "リンク・スフィア", href: "20_佐藤瑠乃/Jackpot/index.html" },
    { title: "Neon Medallion Spin", href: "20_佐藤瑠乃/neon_medallion_spin/index.html" }
  ] },
  { number: "22", name: "隅田 康太", works: [
    { title: "FPS迷路", href: "22_隅田康太/FPS_Maze/index.html" },
    { title: "ペンギン飛ばし", href: "22_隅田康太/Penguin-Shot/index.html" }
  ] },
  { number: "25", name: "武田 和士", works: [{ title: "JavaScript作品", href: "https://irisgravity4-droid.github.io/java/" }] },
  { number: "27", name: "畠山 陽靖", works: [{ title: "CRIMSON LABYRINTH", href: "27_畠山陽靖/Index.html" }] },
  { number: "29", name: "本江 将大", works: [{ title: "COSMIC RAIL 3D", href: "29_本江将大/index.html" }] },
  { number: "30", name: "松木 一紗", works: [{ title: "リズム★オーケストラ", href: "30_松木一紗/index.html" }] },
  { number: "31", name: "松橋 那津希", works: [{ title: "SUB-LEVEL ZERO", href: "31_松橋那津希/about.html" }] },
  { number: "33", name: "宮下 公", works: [{ title: "CYBER ARENA", href: "33_宮下公/index.html" }] },
  { number: "34", name: "山本 龍之介", works: [{ title: "THE INVADER ATTACK", href: "34_山本龍之介/index.html" }] }
];

const list = document.querySelector("#student-list");
const count = document.querySelector("#student-count");

count.textContent = `${students.length}名`;

for (const student of students) {
  const row = document.createElement("article");
  row.className = "student-row";

  const number = document.createElement("span");
  number.className = "student-number";
  number.textContent = student.number;

  const name = document.createElement("h3");
  name.className = "student-name";
  name.textContent = student.name;

  const links = document.createElement("div");
  links.className = "work-links";

  for (const work of student.works) {
    const link = document.createElement("a");
    link.className = "work-link";
    link.href = work.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = work.title;
    link.setAttribute("aria-label", `${student.name}の作品「${work.title}」を開く`);
    links.append(link);
  }

  row.append(number, name, links);
  list.append(row);
}
