import { Icon } from '@/shared/ui/Icon';
import { useToast } from '@/shared/lib/toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SdkCodeSnippetProps {
  blogKey: string;
}

export function SdkCodeSnippet({ blogKey }: SdkCodeSnippetProps) {
  const { showToast } = useToast();

  const codeSnippet = `<head>
  <script src="https://cdn.devad.com/sdk.js"
    blog-key="${blogKey}"></script>
</head>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      showToast('코드가 복사되었습니다', 'success');
    } catch {
      showToast('복사에 실패했습니다', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-1 p-4 rounded-xl min-w-150 bg-gray-800 text-white">
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
        SDK가 자동으로 행동 추적 시작
      </p>
    </div>
  );
}
