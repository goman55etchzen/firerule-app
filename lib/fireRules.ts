// 用途区分の型と定数
export interface CategoryInfo {
  name: string;
  smokePriority: boolean;
}

export const BUILDING_CATEGORIES: Record<string, CategoryInfo> = {
  "1_A": { name: "(1)項イ 劇場・映画館", smokePriority: false },
  "4":   { name: "(4)項 店舗・物販店",     smokePriority: false },
  "6_A": { name: "(6)項イ 病院・診療所",   smokePriority: true },
  "6_C": { name: "(6)項ハ 老人デイサービス", smokePriority: true },
  "15":  { name: "(15)項 事務所・工場",    smokePriority: false },
};

export interface RoomInput {
  name: string;
  area: number;
  ceilingHeight: number;
  isFireRoom: boolean;
  isRefractory: boolean;
  hasOpenings: boolean;
}

export interface EvaluationResult {
  roomName: string;
  detectorType: string;
  coverageArea: number;
  requiredCount: number;
  reasons: string[];
}

// 判定関数
export function evaluateRoom(categoryCode: string, room: RoomInput): EvaluationResult {
  const categoryInfo = BUILDING_CATEGORIES[categoryCode] || BUILDING_CATEGORIES["15"];
  const isMusou = !room.hasOpenings;
  const reasons: string[] = [];
  let detectorType = "";
  let coverageArea = 70.0;

  if (room.isFireRoom) {
    detectorType = "定温式スポット型感知器（熱・防水等）";
    coverageArea = room.isRefractory ? 60.0 : 30.0;
    reasons.push("火気・水蒸気使用室のため誤作動を防ぐ定温式を選定");
  } else if (room.ceilingHeight >= 15.0) {
    detectorType = "炎感知器 または 光電式分離型感知器（煙）";
    coverageArea = 150.0;
    reasons.push("天井高15m以上の高天井条件に適用する機器を選定");
  } else if (room.ceilingHeight >= 8.0) {
    detectorType = "光電式スポット型感知器（煙・2種以上）";
    coverageArea = room.isRefractory ? 150.0 : 75.0;
    reasons.push("天井高8m〜15m条件のため煙感知器を選定");
  } else {
    if (isMusou) {
      detectorType = "光電式スポット型感知器（煙・2種）";
      coverageArea = room.isRefractory ? 150.0 : 75.0;
      reasons.push("無窓居室のため煙感知器を選定");
    } else if (categoryInfo.smokePriority) {
      detectorType = "光電式スポット型感知器（煙・2種）";
      coverageArea = room.isRefractory ? 150.0 : 75.0;
      reasons.push(`${categoryInfo.name}のため早期避難を考慮し煙感知器を優先`);
    } else {
      detectorType = "差動式スポット型感知器（熱・2種）";
      coverageArea = room.isRefractory ? 70.0 : 40.0;
      reasons.push("一般居室のため標準的な差動式（熱）を選定");
    }
  }

  const requiredCount = Math.ceil(room.area / coverageArea);

  return {
    roomName: room.name,
    detectorType,
    coverageArea,
    requiredCount,
    reasons,
  };
}