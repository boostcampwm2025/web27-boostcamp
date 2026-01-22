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

  const autoModeSnippet = `<script src="https://kr.object.ncloudstorage.com/boostad-sdk-dev/sdk/sdk.js"
          data-blog-key="${blogKey}"
          asnyc
  ></script>`;

  const manualModeSnippet = `<script src="https://kr.object.ncloudstorage.com/boostad-sdk-dev/sdk/sdk.js"
          data-blog-key="${blogKey}"
          data-auto="false"
          asnyc
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
    </div>
  );
}
