// src/pages/slide-b-demo.tsx

import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Tag {
  id: number;
  name: string;
}

interface Campaign {
  id: string;
  title: string;
  content: string;
  image: string;
  url: string;
  tags: Tag[];
  explain: string;
  score: number;
}

interface ApiResponse {
  winner: Campaign;
  candidates: Campaign[];
}

export function SlideBDemo() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/b/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: 'post_123',
        tags: ['NestJS', 'TypeScript'],
        postURL: 'https://blog.example.com/nestjs-intro',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <div>
      <h1>Slide B Demo</h1>

      {/* 광고 SDK Zone (Winner) */}
      <section>
        <h2>🏆 광고 SDK Zone (Winner)</h2>
        <div
          style={{
            border: '2px solid gold',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h3>{data.winner.title}</h3>
          <p>{data.winner.content}</p>
          <p>
            <strong>점수:</strong> {data.winner.score}
          </p>
          <p>
            <strong>설명:</strong> {data.winner.explain}
          </p>
          <a href={data.winner.url} target="_blank" rel="noopener noreferrer">
            바로가기 →
          </a>
        </div>
      </section>

      {/* Debug Panel (Candidates) */}
      <section>
        <h2>🐛 Debug Panel (후보 목록)</h2>
        {data.candidates.map((c) => (
          <div
            key={c.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <h4>{c.title}</h4>
            <p>
              <strong>점수:</strong> {c.score}
            </p>
            <p>
              <strong>설명:</strong> {c.explain}
            </p>
            <p>
              <strong>태그:</strong> {c.tags.map((t) => t.name).join(', ')}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
