import { NextResponse } from 'next/server';
import { evaluateRoom, RoomInput } from '@/lib/fireRules';
import { db } from '@/lib/db';
import { calculationLogs, detectors } from '@/lib/db/schema';
import { eq, gte } from 'drizzle-orm';

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

    // 2. Neon DB から条件を満たす推奨型番の検索（例: 適用天井高以上の機器）
    const matchedDetectors = await db
      .select()
      .from(detectors)
      .where(gte(detectors.maxHeight, room.ceilingHeight))
      .limit(3);

    // 3. 判定ログを DB に保存
    await db.insert(calculationLogs).values({
      projectName: projectName || '未設定物件',
      roomName: room.name,
      area: room.area,
      ceilingHeight: room.ceilingHeight,
      recommendedDetector: evalResult.detectorType,
      requiredCount: evalResult.requiredCount,
    });

    return NextResponse.json({
      success: true,
      result: evalResult,
      suggestedProducts: matchedDetectors, // DBから検索されたメーカー・型番候補
    });
  } catch (error) {
    console.error('Database/API Error:', error);
    return NextResponse.json(
      { success: false, message: '判定またはデータ保存に失敗しました。' },
      { status: 500 }
    );
  }
}
