import type { AccountType } from '../model/types';

interface TermsModalProps {
  accountType: AccountType;
  onClose: () => void;
  onAgree: () => void;
}

export function TermsModal({ accountType, onClose, onAgree }: TermsModalProps) {
  const isAdvertiser = accountType === 'ADVERTISER';

  const handleAgree = () => {
    onAgree();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(244, 244, 244, 0.3)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">
            BoostAD {isAdvertiser ? '광고주' : '퍼블리셔'} 이용약관
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 내용 */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-6 py-4">
          {isAdvertiser ? (
            <AdvertiserTermsContent />
          ) : (
            <PublisherTermsContent />
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          <button
            onClick={handleAgree}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold"
          >
            동의합니다
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// 광고주 약관 내용
function AdvertiserTermsContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h3 className="text-lg font-semibold mb-3">제1조 (목적)</h3>
        <p>
          본 약관은 BoostAD(이하 "회사")가 광고주에게 제공하는 데이터의 이용
          조건 및 준수 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제2조 (정의)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            "광고주"란 회사의 광고 플랫폼을 이용하여 광고 캠페인을 집행하는 자를
            의미합니다.
          </li>
          <li>
            "제공 데이터"란 회사가 광고주에게 제공하는 행태정보 기반 세그먼트,
            통계, 광고 효율 지표 등을 의미합니다.
          </li>
          <li>
            "최종 사용자"란 퍼블리셔의 웹사이트를 방문하여 광고에 노출된 일반
            이용자를 의미합니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제3조 (데이터 제공 범위)</h3>
        <p className="mb-2">회사는 광고주에게 다음 데이터를 제공합니다:</p>
        <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
          <li>세그먼트 정보: 고의도 여부, 관심 카테고리</li>
          <li>광고 효율 지표: 노출 수, 클릭 수, 클릭률, 전환율</li>
          <li>집계 통계: 시간대별, 카테고리별, 블로그별 집계 데이터</li>
        </ul>
        <p className="font-semibold mb-2">제공하지 않는 데이터:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>개인을 직접 식별할 수 있는 정보</li>
          <li>구체적인 행동 점수</li>
          <li>개별 사용자의 세부 행동 로그</li>
          <li>방문한 구체적인 URL</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">
          제4조 (데이터 이용 목적 제한)
        </h3>
        <p className="mb-2">
          개인정보보호법 제18조에 따라 광고주는 제공받은 데이터를 오직 다음
          목적으로만 이용할 수 있습니다:
        </p>
        <p className="font-semibold mb-2">허용되는 이용:</p>
        <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
          <li>BoostAD 플랫폼 내 광고 캠페인 집행</li>
          <li>광고 효율 분석 및 캠페인 최적화</li>
          <li>내부 마케팅 전략 수립</li>
        </ul>
        <p className="font-semibold mb-2">금지되는 이용:</p>
        <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
          <li>자사 CRM 데이터와 결합하는 행위</li>
          <li>타 광고 플랫폼에서 사용하는 행위</li>
          <li>제3자에게 재판매 또는 재제공하는 행위</li>
          <li>개인을 재식별하려는 시도</li>
        </ul>
        <p className="font-semibold">위반 시:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>즉시 계약 해지</li>
          <li>개인정보보호법 위반으로 과징금 부과 가능</li>
          <li>형사 처벌 가능</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">
          제5조 (데이터 재식별 금지)
        </h3>
        <p className="mb-2">
          광고주는 제공받은 익명화/가명화 데이터를 다음 방법으로 재식별하는
          행위를 절대 금지합니다:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4 mb-2">
          <li>BoostAD 세그먼트 ID와 자사 보유 쿠키 ID 매칭</li>
          <li>BoostAD 카테고리 정보와 자사 구매 이력 결합</li>
          <li>해시화된 URL 역추적 시도</li>
          <li>IP 주소, 디바이스 정보 등을 이용한 크로스 매칭</li>
        </ul>
        <p>
          광고주는 "특정 개인을 식별할 수 없는 상태"를 유지해야 하며,
          기술적·조직적 조치를 취해야 합니다.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제6조 (데이터 보관 기간)</h3>
        <p className="mb-2">
          개인정보보호법 제21조에 따라 광고주는 제공받은 데이터를 다음 기간 내에
          파기해야 합니다:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4 mb-2">
          <li>세그먼트 정보: 최대 90일 (캠페인 종료 후)</li>
          <li>광고 효율 지표: 최대 1년 (캠페인 종료 후)</li>
          <li>개별 노출/클릭 로그: 최대 90일 (수집 후)</li>
        </ul>
        <p className="font-semibold mb-2">파기 방법:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>복구 불가능한 방법으로 완전 삭제</li>
          <li>삭제 증빙 기록 보관 (회사 요청 시 제출)</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제7조 (보안 의무)</h3>
        <p className="mb-2">
          광고주는 제공받은 데이터의 유출, 변조, 훼손을 방지하기 위해 다음 보안
          조치를 취해야 합니다:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>접근 권한 관리: 필요 최소 인원만 접근</li>
          <li>암호화: 저장 및 전송 시 암호화</li>
          <li>로그 관리: 접근 기록 보관 (최소 6개월)</li>
          <li>정기 감사: 분기별 자체 점검</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제8조 (책임 및 손해배상)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            광고주가 본 약관을 위반하여 발생한 모든 법적 책임은 광고주가
            단독으로 부담합니다.
          </li>
          <li>
            광고주의 약관 위반으로 회사가 손해를 입은 경우, 광고주는 회사에게
            손해를 배상해야 합니다.
          </li>
          <li>
            광고주의 약관 위반으로 최종 사용자 또는 제3자가 피해를 입은 경우,
            광고주는 해당 피해를 배상해야 합니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제9조 (감사 및 점검)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            회사는 광고주의 데이터 이용 현황을 정기적으로 점검할 수 있습니다.
          </li>
          <li>
            회사는 약관 위반이 의심되는 경우 즉시 감사를 실시할 수 있습니다.
          </li>
          <li>광고주는 회사의 감사에 적극 협조해야 합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제10조 (계약 해지)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            회사는 광고주가 본 약관을 위반한 경우 즉시 계약을 해지할 수
            있습니다.
          </li>
          <li>
            계약 해지 시 광고주는 보유 중인 모든 데이터를 즉시 파기해야 합니다.
          </li>
          <li>계약 해지에도 불구하고 광고주의 손해배상 책임은 유지됩니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제11조 (준거법 및 관할)</h3>
        <p>
          본 약관은 대한민국 개인정보보호법을 포함한 관련 법령에 따라 규율되며,
          분쟁 발생 시 회사 본사 소재지 관할 법원을 전속 관할로 합니다.
        </p>
      </section>
    </div>
  );
}

// 퍼블리셔 약관 내용
function PublisherTermsContent() {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h3 className="text-lg font-semibold mb-3">제1조 (목적)</h3>
        <p>
          본 약관은 BoostAD(이하 "회사")가 제공하는 광고 중개 서비스(이하
          "서비스")를 퍼블리셔(블로거, 웹사이트 운영자)가 이용함에 있어 회사와
          퍼블리셔 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제2조 (정의)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            "서비스"란 회사가 제공하는 SDK 및 광고 중개 플랫폼을 의미합니다.
          </li>
          <li>
            "퍼블리셔"란 본 약관에 동의하고 회사의 SDK를 자신의 웹사이트 또는
            블로그에 설치하여 광고를 게재하는 자를 의미합니다.
          </li>
          <li>
            "SDK"란 회사가 제공하는 JavaScript 기반 소프트웨어 개발 키트를
            의미합니다.
          </li>
          <li>
            "최종 사용자"란 퍼블리셔의 웹사이트 또는 블로그를 방문하는 일반
            이용자를 의미합니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제3조 (SDK 설치 및 운영)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            퍼블리셔는 회사가 제공하는 SDK를 자신의 웹사이트에 설치하여 광고를
            게재할 수 있습니다.
          </li>
          <li>
            퍼블리셔는 SDK 설치 전 반드시 다음 사항을 준수해야 합니다:
            <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
              <li>
                최종 사용자에게 동의 배너를 설치하여 행태정보 수집 동의를 받을
                것
              </li>
              <li>
                웹사이트의 개인정보처리방침에 BoostAD 행태정보 처리 내용을
                명시할 것
              </li>
              <li>
                최종 사용자가 동의를 거부할 경우 SDK의 행태 추적 기능을
                비활성화할 것
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">
          제4조 (개인정보 보호 의무)
        </h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            퍼블리셔는 개인정보보호법 제15조, 제17조, 제22조의2에 따라 최종
            사용자의 개인정보를 보호할 책임이 있습니다.
          </li>
          <li>
            퍼블리셔는 최종 사용자로부터 다음 사항에 대한 사전 동의를 받아야
            합니다:
            <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
              <li>행태정보(스크롤, 체류시간, 클릭, 복사 등) 수집</li>
              <li>수집된 정보의 회사(BoostAD) 제공</li>
              <li>맞춤형 광고 제공 목적 이용</li>
            </ul>
          </li>
          <li>
            퍼블리셔는 만 14세 미만 아동을 주요 대상으로 하는 웹사이트에 SDK를
            설치할 수 없습니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">
          제5조 (데이터 제공 및 처리)
        </h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            퍼블리셔는 SDK를 통해 수집된 최종 사용자의 행태정보가 회사에게
            제공됨을 인지하고 동의합니다.
          </li>
          <li>
            회사는 제공받은 행태정보를 다음 목적으로만 처리합니다:
            <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
              <li>광고 선정 및 게재</li>
              <li>광고 효율 측정 및 분석</li>
              <li>서비스 개선</li>
            </ul>
          </li>
          <li>
            회사는 개인을 식별할 수 있는 정보(이름, 전화번호, 이메일 등)를
            수집하지 않으며, 행태정보의 익명성을 유지합니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제6조 (수익 배분)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>회사는 광고 수익의 70%를 퍼블리셔에게 지급합니다.</li>
          <li>
            수익 정산은 매월 말일 기준으로 산정되며, 익월 15일에 지급됩니다.
          </li>
          <li>최소 지급 금액은 10,000원이며, 미만 시 다음 달로 이월됩니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제7조 (퍼블리셔의 의무)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            퍼블리셔는 다음 행위를 해서는 안 됩니다:
            <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
              <li>SDK 코드를 임의로 수정 또는 변조하는 행위</li>
              <li>부정한 방법으로 광고 클릭 또는 노출을 유도하는 행위</li>
              <li>최종 사용자의 동의 없이 행태정보를 수집하는 행위</li>
              <li>불법 콘텐츠를 게재하는 행위</li>
            </ul>
          </li>
          <li>
            위반 시 회사는 즉시 계약을 해지하고 수익 지급을 중단할 수 있습니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제8조 (책임의 제한)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            회사는 퍼블리셔가 최종 사용자의 동의를 받지 않아 발생한
            개인정보보호법 위반에 대해 책임지지 않습니다.
          </li>
          <li>
            퍼블리셔는 동의 배너 미설치, 개인정보처리방침 미작성 등으로 인한
            법적 책임을 단독으로 부담합니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제9조 (계약 해지)</h3>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>퍼블리셔는 언제든지 계약을 해지할 수 있습니다.</li>
          <li>
            회사는 퍼블리셔가 본 약관을 위반한 경우 즉시 계약을 해지할 수
            있습니다.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제10조 (준거법 및 관할)</h3>
        <p>
          본 약관은 대한민국 법률에 따라 규율되며, 분쟁 발생 시 회사 본사 소재지
          관할 법원을 전속 관할로 합니다.
        </p>
      </section>
    </div>
  );
}
