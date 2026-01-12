import { Icon } from '@/shared/ui/Icon';

export function SdkCodeSnippet() {
  const handleCopy = () => {
    // 복사
  };

  return (
    <div>
      <div className="border border-amber-600">
        <span className="border border-amber-600">snippet 제목</span>
        <button className="border border-amber-600" onClick={handleCopy}>
          <Icon.Copy className="w-8 h-8" />
          <span>복사하기</span>
        </button>
      </div>
      <div className="border border-amber-600">
        <pre>
          <code>{`<head>
  <script src="https://cdn.devad.com/sdk.js"
    blog-key="blog-123"></script>
</head>`}</code>
        </pre>
      </div>
    </div>
  );
}
