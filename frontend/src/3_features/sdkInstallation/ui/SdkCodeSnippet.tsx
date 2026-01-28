import { useState } from 'react';
import { Icon } from '@shared/ui/Icon';
import { useToast } from '@shared/lib/toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { SdkMode } from './SdkModeToggle';

interface SdkCodeSnippetProps {
  blogKey: string;
  mode: SdkMode;
}

export function SdkCodeSnippet({ blogKey, mode }: SdkCodeSnippetProps) {
  const { showToast } = useToast();
  const [contextValue, setContextValue] = useState('');

  const sdkUrl =
    import.meta.env.MODE === 'development'
      ? 'https://localhost/sdk/sdk.js'
      : 'https://kr.object.ncloudstorage.com/boostad-sdk-dev/sdk/sdk.js';

  const autoModeSnippet = `<script src="${sdkUrl}"
          data-blog-key="${blogKey}"
          async
  ></script>`;

  const manualModeSnippet = `<script src="${sdkUrl}"
          data-blog-key="${blogKey}"
          data-auto="false"${contextValue ? `\n          data-context="${contextValue}"` : '\n          data-context="아래 필드에서 입력해주세요🔻"'}
          async
  ></script>

// 광고를 노출할 위치에 추가하세요
<div data-boostad-zone></div>`;

  const codeSnippet = mode === 'auto' ? autoModeSnippet : manualModeSnippet;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      showToast('코드가 복사되었습니다', 'success');
    } catch {
      showToast('복사에 실패했습니다', 'error');
    }
  };

  return (
    <div className="flex flex-col w-150 items-center gap-2">
      <div className="flex flex-col w-full gap-1 p-4 rounded-xl bg-gray-800 text-white">
        <div className="flex flex-row justify-between">
          <span className="flex items-center text-xs text-gray-400">
            index.html (head)
          </span>
          <button
            className="flex flex-row bg-blue-500 items-center px-2 py-1 gap-1.5 text-white rounded-lg"
            onClick={handleCopy}
          >
            <Icon.Copy className="w-4" />
            <span className="text-xs font-medium cursor-pointer">복사하기</span>
          </button>
        </div>
        <div className="text-xs overflow-x-auto">
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent',
              fontSize: '0.75rem',
            }}
            codeTagProps={{
              style: {
                fontFamily: 'monospace',
              },
            }}
          >
            {codeSnippet}
          </SyntaxHighlighter>
        </div>
      </div>
      <p className="text-xs font-normal whitespace-nowrap text-gray-500">
        SDK가 자동으로 행동 추적 시작 (쿠키 미사용)
      </p>

      {mode === 'manual' && (
        <div className="flex flex-col w-full gap-2 mb-4">
          <label className="text-sm font-medium text-gray-700">
            광고 컨텍스트 <span className='text-red-700'>(*필수)</span>
          </label>
          <input
            type="text"
            value={contextValue}
            onChange={(e) => setContextValue(e.target.value)}
            placeholder="예: 실시간 협업 도구"
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <p className="text-xs text-gray-500">
            입력한 내용이 위 코드의 data-context 속성에 반영됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
