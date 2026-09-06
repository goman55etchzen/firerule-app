import { NextResponse } from 'next/server';
import { evaluateRoom, RoomInput } from '@/lib/fireRules';
import { db } from '@/lib/db';
import { calculationLogs, detectors } from '@/lib/db/schema';
import { gte } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, categoryCode, room } = body as {
      projectName: string;
      categoryCode: string;
      room: RoomInput;
    };

    // 1. 消防法ロジックによる基本判定
    const evalResult = evaluateRoom(categoryCode, room);

    // 2. DBから条件に合う感知器を検索
    const matchedDetectors = await db
      .select()
      .from(detectors)
      .where(gte(detectors.maxHeight, room.ceilingHeight))
      .limit(3);

    // 3. 計算ログをDBに保存
    await db.insert(calculationLogs).values({
      projectName: projectName || '未設定物件',
      roomName: room.name,
      area: room.area,
      ceilingHeight: room.ceilingHeight,
      recommendedDetector: evalResult.detectorType,
      requiredCount: evalResult.requiredCount,
    });

    // 4. 実データ（検索結果が空の場合は空配列）を返却
    return NextResponse.json({
      success: true,
      result: evalResult,
      suggestedProducts: matchedDetectors,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '判定または保存に失敗しました。' },
      { status: 500 }
    );
  }
}