'use client';

import { useState } from 'react';
import { BUILDING_CATEGORIES, EvaluationResult } from '@/lib/fireRules';

// Neon DBから返却される機器情報の型定義
interface DetectorProduct {
  id: number;
  modelNumber: string;
  maker: string;
  type: string;
  maxHeight: number;
  coverageFireproof: number;
  coverageNonFireproof: number;
}

export default function Home() {
  const [buildingName, setBuildingName] = useState('サンプルビル');
  const [categoryCode, setCategoryCode] = useState('15');
  const [roomName, setRoomName] = useState('1階 事務室');
  const [area, setArea] = useState<number>(50);
  const [ceilingHeight, setCeilingHeight] = useState<number>(2.7);
  const [isFireRoom, setIsFireRoom] = useState(false);
  const [isRefractory, setIsRefractory] = useState(true);
  const [hasOpenings, setHasOpenings] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<DetectorProduct[]>(
    []
  );

  // API Route (Neon DB連動) へリクエストを送信
  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: buildingName,
          categoryCode,
          room: {
            name: roomName,
            area,
            ceilingHeight,
            isFireRoom,
            isRefractory,
            hasOpenings,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        setSuggestedProducts(data.suggestedProducts || []);
      } else {
        alert(data.message || '判定処理でエラーが発生しました。');
      }
    } catch (error) {
      console.error('API Error:', error);
      alert(
        '通信エラーが発生しました。DB接続およびAPIの起動を確認してください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      style={{
        padding: '24px',
        maxWidth: '640px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>消防用感知器 自動選定システム (Next.js × Neon DB)</h1>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>建物名称</label>
        <input
          type="text"
          value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          用途区分（令別表第一）
        </label>
        <select
          value={categoryCode}
          onChange={(e) => setCategoryCode(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        >
          {Object.entries(BUILDING_CATEGORIES).map(([code, info]) => (
            <option key={code} value={code}>
              {info.name}
            </option>
          ))}
        </select>
      </div>

      <hr style={{ margin: '24px 0' }} />

      <h3>部屋条件の入力</h3>

      <div style={{ marginBottom: '12px' }}>
        <label>部屋名称: </label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{ padding: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>床面積 (㎡): </label>
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          style={{ padding: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>天井高 (m): </label>
        <input
          type="number"
          step="0.1"
          value={ceilingHeight}
          onChange={(e) => setCeilingHeight(Number(e.target.value))}
          style={{ padding: '4px' }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          margin: '16px 0',
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={isFireRoom}
            onChange={(e) => setIsFireRoom(e.target.checked)}
          />{' '}
          厨房・火気使用室
        </label>
        <label>
          <input
            type="checkbox"
            checked={isRefractory}
            onChange={(e) => setIsRefractory(e.target.checked)}
          />{' '}
          耐火構造
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasOpenings}
            onChange={(e) => setHasOpenings(e.target.checked)}
          />{' '}
          有効な開口部あり（普通居室）
        </label>
      </div>

      <button
        onClick={handleCalculate}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          background: isLoading ? '#ccc' : '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'DB照会中...' : '判定・DB保存を実行'}
      </button>

      {result && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <h2>判定結果（DB保存完了）</h2>
          <p>
            <strong>【部屋】:</strong> {result.roomName}
          </p>
          <p>
            <strong>推奨感知器種別:</strong> {result.detectorType}
          </p>
          <p>
            <strong>必要数量:</strong> {result.requiredCount} 個 （警戒面積単位:{' '}
            {result.coverageArea} ㎡）
          </p>
          <p>
            <strong>選定理由:</strong> {result.reasons.join(' / ')}
          </p>

          {suggestedProducts.length > 0 && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #ccc',
              }}
            >
              <h3>候補となる機器型番（Neon DBより参照）</h3>
              <ul>
                {suggestedProducts.map((prod) => (
                  <li key={prod.id} style={{ marginBottom: '8px' }}>
                    <strong>
                      {prod.maker} - {prod.modelNumber}
                    </strong>{' '}
                    ({prod.type})<br />
                    <small>
                      適用天井高: 〜{prod.maxHeight}m / 警戒面積:{' '}
                      {isRefractory
                        ? prod.coverageFireproof
                        : prod.coverageNonFireproof}
                      ㎡
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
