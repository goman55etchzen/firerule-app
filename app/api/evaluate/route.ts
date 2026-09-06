import { NextResponse } from 'next/server';
import { evaluateRoom, RoomInput } from '@/lib/fireRules';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, categoryCode, room } = body as {
      projectName: string;
      categoryCode: string;
      room: RoomInput;
    };

    // 1. 消防法ロジックによる基本判定（DB不要で計算可能）
    const evalResult = evaluateRoom(categoryCode, room);

    // TODO: DB作成・マイグレーション完了後に以下のDB処理を有効化する
    /*
    const matchedDetectors = await db
      .select()
      .from(detectors)
      .where(gte(detectors.maxHeight, room.ceilingHeight))
      .limit(3);

    await db.insert(calculationLogs).values({
      projectName: projectName || '未設定物件',
      roomName: room.name,
      area: room.area,
      ceilingHeight: room.ceilingHeight,
      recommendedDetector: evalResult.detectorType,
      requiredCount: evalResult.requiredCount,
    });
    */

    // DB未接続時のダミー機器データ
    const dummyProducts = [
      {
        id: 1,
        modelNumber: 'SLV-2（ダミー型番）',
        maker: 'ホーチキ',
        type: evalResult.detectorType,
        maxHeight: 15.0,
        coverageFireproof: 150,
        coverageNonFireproof: 75,
      },
    ];

    return NextResponse.json({
      success: true,
      result: evalResult,
      suggestedProducts: dummyProducts,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '判定に失敗しました。' },
      { status: 500 }
    );
  }
}