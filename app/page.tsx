'use client';

import { useState } from 'react';
import { BUILDING_CATEGORIES, EvaluationResult } from '@/lib/fireRules';

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
  const [suggestedProducts, setSuggestedProducts] = useState<DetectorProduct[]>([]);

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
      alert('通信エラーが発生しました。DB接続およびAPIの起動を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: '10px 14px',
    color: '#f8fafc',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh' }}>
      <main
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#1e293b',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid #334155',
        }}
      >
        <h1 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
          消防用感知器 自動選定システム
        </h1>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', fontSize: '13px' }}>
            建物名称
          </label>
          <input
            type="text"
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', fontSize: '13px' }}>
            用途区分（令別表第一）
          </label>
          <select
            value={categoryCode}
            onChange={(e) => setCategoryCode(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          >
            {Object.entries(BUILDING_CATEGORIES).map(([code, info]) => (
              <option key={code} value={code} style={{ color: '#f8fafc', backgroundColor: '#0f172a' }}>
                {info.name}
              </option>
            ))}
          </select>
        </div>

        <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid #334155' }} />

        <h2 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: 'bold', marginBottom: '18px' }}>
          部屋条件の入力
        </h2>

        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '110px', color: '#94a3b8', fontSize: '14px' }}>部屋名称</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '110px', color: '#94a3b8', fontSize: '14px' }}>床面積 (㎡)</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            style={{ ...inputStyle, width: '130px' }}
          />
        </div>

        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center' }}>
          <label style={{ width: '110px', color: '#94a3b8', fontSize: '14px' }}>天井高 (m)</label>
          <input
            type="number"
            step="0.1"
            value={ceilingHeight}
            onChange={(e) => setCeilingHeight(Number(e.target.value))}
            style={{ ...inputStyle, width: '130px' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            margin: '24px 0',
            color: '#cbd5e1',
            fontSize: '14px',
          }}
        >
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isFireRoom}
              onChange={(e) => setIsFireRoom(e.target.checked)}
              style={{ accentColor: '#0284c7' }}
            />{' '}
            厨房・火気使用室
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isRefractory}
              onChange={(e) => setIsRefractory(e.target.checked)}
              style={{ accentColor: '#0284c7' }}
            />{' '}
            耐火構造
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={hasOpenings}
              onChange={(e) => setHasOpenings(e.target.checked)}
              style={{ accentColor: '#0284c7' }}
            />{' '}
            有効な開口部あり（普通居室）
          </label>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#475569' : '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: '8px',
          }}
        >
          {isLoading ? 'DB照会中...' : '判定・DB保存を実行'}
        </button>

        {result && (
          <div
            style={{
              marginTop: '28px',
              padding: '20px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '1px solid #334155',
              color: '#f8fafc',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>
              判定結果（DB保存完了）
            </h3>
            <p style={{ margin: '6px 0', fontSize: '14px' }}>
              <strong style={{ color: '#94a3b8' }}>【部屋】:</strong> {result.roomName}
            </p>
            <p style={{ margin: '6px 0', fontSize: '14px' }}>
              <strong style={{ color: '#94a3b8' }}>推奨感知器種別:</strong> {result.detectorType}
            </p>
            <p style={{ margin: '6px 0', fontSize: '14px' }}>
              <strong style={{ color: '#94a3b8' }}>必要数量:</strong> {result.requiredCount} 個 （警戒面積単位: {result.coverageArea} ㎡）
            </p>
            <p style={{ margin: '6px 0', fontSize: '14px' }}>
              <strong style={{ color: '#94a3b8' }}>選定理由:</strong> {result.reasons.join(' / ')}
            </p>

            {suggestedProducts.length > 0 && (
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #334155',
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px' }}>
                  候補となる機器型番（Neon DBより参照）
                </h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {suggestedProducts.map((prod) => (
                    <li key={prod.id} style={{ marginBottom: '8px', color: '#cbd5e1', fontSize: '13px' }}>
                      <strong style={{ color: '#f8fafc' }}>
                        {prod.maker} - {prod.modelNumber}
                      </strong>{' '}
                      ({prod.type})<br />
                      <span style={{ color: '#64748b' }}>
                        適用天井高: 〜{prod.maxHeight}m / 警戒面積:{' '}
                        {isRefractory ? prod.coverageFireproof : prod.coverageNonFireproof} ㎡
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}