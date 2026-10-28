export type Category = "全部好物" | "桌面好物" | "居家氛围" | "日常器物";
export type Scene = "all" | "focus" | "slow" | "gift";
export type Product = {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<Category, "全部好物">;
  price: number;
  image: string;
  imagePosition?: string;
  tag?: string;
  color: string;
  material: string;
  size: string;
  description: string;
  scenes: Scene[];
  keywords: string;
};

export const categories: Category[] = [
  "全部好物",
  "桌面好物",
  "居家氛围",
  "日常器物",
];
export const scenes: { id: Scene; label: string; description: string }[] = [
  { id: "all", label: "所有场景", description: "发现日常的小美好" },
  { id: "focus", label: "专注办公", description: "让灵感，有处安放" },
  { id: "slow", label: "晚间放松", description: "把时间，慢慢还给自己" },
  { id: "gift", label: "心意礼物", description: "300 元以内的温柔心意" },
];

const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;

// Prices use integer fen. All catalog details and stock limits are demonstration data.
export const products: Product[] = [
  {
    id: "warm-lamp",
    name: "暖光 · 桌面台灯",
    subtitle: "留一盏灯，给自己的时间",
    category: "居家氛围",
    price: 23900,
    image: image("lamp"),
    tag: "编辑精选",
    color: "石墨灰",
    material: "金属灯体、金属灯罩",
    size: "约 28 × 42 cm",
    description:
      "用柔和的暖光，划出一天里属于自己的片刻。简洁的轮廓融入床头与桌角，陪伴阅读、书写和不赶时间的夜晚。",
    scenes: ["focus", "slow", "gift"],
    keywords: "灯 灯具 阅读 床头 照明",
  },
  {
    id: "cloud-mug",
    name: "云朵 · 陶瓷马克杯",
    subtitle: "把温热，捧在手心",
    category: "日常器物",
    price: 8900,
    image: image("mug"),
    tag: "人气好物",
    color: "奶油白",
    material: "高温烧制陶瓷",
    size: "约 350 mL",
    description:
      "为每天的第一杯咖啡，留一点仪式感。圆润的杯身与舒适的握感，让喝水、喝茶和短暂的休息都变得值得期待。",
    scenes: ["focus", "slow", "gift"],
    keywords: "杯子 咖啡 茶 水杯 陶瓷",
  },
  {
    id: "forest-candle",
    name: "林间 · 香氛蜡烛",
    subtitle: "点亮一小片安静森林",
    category: "居家氛围",
    price: 12900,
    image: image("candle"),
    tag: "慢生活",
    color: "琥珀棕",
    material: "植物蜡、棉质烛芯、玻璃杯",
    size: "约 200 g",
    description:
      "木质与草本调交织，给晚间的空间添一份安静。读几页书，放一首喜欢的音乐，让忙碌停在门外。使用时请保持通风，远离易燃物并有人看管。",
    scenes: ["slow", "gift"],
    keywords: "香薰 香氛 蜡烛 木质 放松",
  },
  {
    id: "green-plant",
    name: "青绿 · 桌面盆栽",
    subtitle: "一抹绿意，一点生机",
    category: "桌面好物",
    price: 6900,
    image: image("plant"),
    color: "薄荷绿",
    material: "多肉植物、陶瓷盆",
    size: "含盆高约 20–30 cm",
    description:
      "给屏幕旁留一个绿色的位置。小巧的观叶植物搭配素净花盆，为工作间隙带来轻松一瞥。建议置于明亮散射光处，土壤干燥后适量浇水。",
    scenes: ["focus", "gift"],
    keywords: "植物 绿植 盆栽 花盆 装饰",
  },
  {
    id: "soft-throw",
    name: "午后 · 柔软盖毯",
    subtitle: "给沙发上的自己一个拥抱",
    category: "居家氛围",
    price: 16900,
    image: image("throw"),
    tag: "舒适之选",
    color: "烟灰色",
    material: "棉混纺织物",
    size: "约 130 × 170 cm",
    description:
      "从午后小憩到深夜追剧，柔软的织物接住每一次放松。轻盈且温暖，随手搭在沙发上，也是一处自然的风景。建议冷水轻柔洗涤。",
    scenes: ["slow", "gift"],
    keywords: "毯子 毛毯 棉毯 沙发 保暖",
  },
  {
    id: "quiet-vase",
    name: "素形 · 陶艺花器",
    subtitle: "让一枝花，也有好归处",
    category: "日常器物",
    price: 11900,
    image: image("vase"),
    color: "米白色",
    material: "陶瓷",
    size: "约 12 × 21 cm",
    description:
      "不规则的细微肌理，是器物自然的表情。插一枝鲜花或几支干花，也可以独自摆放，让桌面多一点呼吸的空间。",
    scenes: ["slow", "gift"],
    keywords: "花瓶 花器 陶瓷 干花 摆件",
  },
  {
    id: "daily-notebook",
    name: "日记 · 灵感笔记本",
    subtitle: "写下来，让想法落地",
    category: "桌面好物",
    price: 4900,
    image: image("notebook"),
    color: "原纸色",
    material: "纸张、硬质封面",
    size: "A5，约 14.8 × 21 cm",
    description:
      "用纸笔整理头绪，也收集一闪而过的灵感。无日期的内页不催促进度，清单、随笔与涂鸦都可以在这里自在发生。",
    scenes: ["focus", "gift"],
    keywords: "笔记本 本子 纸张 手账 文具",
  },
  {
    id: "time-clock",
    name: "时光 · 简约挂钟",
    subtitle: "按自己的节奏，慢慢来",
    category: "居家氛围",
    price: 15900,
    image: image("clock"),
    color: "黑白色",
    material: "金属外框、石英机芯",
    size: "直径约 30 cm",
    description:
      "清晰的刻度与简约的轮廓，让时间安静地成为空间的一部分。适合书房或客厅；使用一节 AA 电池，演示商品不含电池。",
    scenes: ["focus", "slow", "gift"],
    keywords: "钟 时钟 挂钟 时间 木质",
  },
  {
    id: "coffee-ritual",
    name: "晨间 · 手冲咖啡壶",
    subtitle: "从一杯咖啡，开始今天",
    category: "日常器物",
    price: 18900,
    image: image("coffee"),
    tag: "日常仪式",
    color: "透明色",
    material: "耐热玻璃、木质握柄",
    size: "约 600 mL",
    description:
      "把烧水、研磨和等待，都变成清晨的留白。通透玻璃让萃取过程清晰可见，适合与朋友分享，也适合独处。请避免骤冷骤热。",
    scenes: ["focus", "slow", "gift"],
    keywords: "咖啡 咖啡壶 手冲 玻璃 分享壶",
  },
  {
    id: "soft-cushion",
    name: "依靠 · 柔软靠枕",
    subtitle: "给每一次坐下，多一点舒适",
    category: "居家氛围",
    price: 9900,
    image: image("cushion"),
    color: "纯白色",
    material: "棉质枕套、聚酯填充",
    size: "约 45 × 45 cm",
    description:
      "一只蓬松抱枕，让熟悉的角落更想久坐。亲肤的面料与干净的白色，适合放在沙发或阅读椅上。枕套可拆洗。",
    scenes: ["slow", "gift"],
    keywords: "抱枕 靠垫 枕头 沙发 棉麻",
  },
  {
    id: "natural-basket",
    name: "归处 · 编织收纳篮",
    subtitle: "让零碎，各得其所",
    category: "桌面好物",
    price: 7900,
    image: image("basket"),
    color: "天然麦色",
    material: "天然植物纤维编织",
    size: "约 22 × 18 cm",
    description:
      "收起散落的小物件，也收起视觉里的忙乱。自然的编织纹理带来温暖触感，可用于整理文具、充电线或随手小物。请保持干燥。",
    scenes: ["focus", "gift"],
    keywords: "收纳 篮子 编织 杂物 整理",
  },
  {
    id: "reading-chair",
    name: "栖息 · 休闲单椅",
    subtitle: "为一本好书，留一个位置",
    category: "居家氛围",
    price: 69900,
    image: image("chair"),
    color: "浅灰色",
    material: "木质框架、织物软垫",
    size: "约 62 × 68 × 78 cm",
    description:
      "在窗边或书架旁，安放一个愿意停留的角落。木质框架搭配柔软坐垫，让阅读、发呆与日常休息有一个舒适的位置。",
    scenes: ["slow"],
    keywords: "椅子 单椅 阅读椅 家具 木椅",
  },
];

export const productById = new Map(
  products.map((product) => [product.id, product]),
);
