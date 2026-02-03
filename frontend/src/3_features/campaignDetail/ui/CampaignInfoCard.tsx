import { Icon } from '@shared/ui/Icon';
import { Tag } from '@shared/ui/Tag';
import type { Tag as TagType } from '../lib/types';

interface CampaignInfoCardProps {
  image: string;
  title: string;
  content: string;
  tags: TagType[];
  url: string;
  isHighIntent: boolean;
  startDate: string;
  endDate: string;
  noBorder?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function truncateUrl(url: string, maxLength: number = 25): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength) + '...';
}

export function CampaignInfoCard({
  image,
  title,
  content,
  tags,
  url,
  isHighIntent,
  startDate,
  endDate,
  noBorder = false,
}: CampaignInfoCardProps) {
  return (
    <div
      className={
        noBorder ? 'p-6' : 'p-6 bg-white border border-gray-200 rounded-xl'
      }
    >
      <p className="text-sm text-gray-500 mb-4">기본 정보</p>

      <div className="flex gap-6">
        {/* 이미지 영역 */}
        <div className="w-40 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon.ImageArea className="w-10 h-10 text-gray-400" />
          )}
        </div>

        {/* 정보 영역 */}
        <div className="flex flex-col gap-3 flex-1">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{content}</p>
          </div>

          {/* 키워드 태그 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag.id} variant="default">
                {tag.name}
              </Tag>
            ))}
          </div>

          {/* 추가 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:underline"
            >
              <Icon.Link className="w-4 h-4" />
              {truncateUrl(url)}
            </a>

            <div className="flex items-center gap-1">
              <Icon.BadgeCheck className="w-4 h-4" />
              {isHighIntent ? '고의도 방문자 전용' : '일반 방문자'}
            </div>

            <div className="flex items-center gap-1">
              <Icon.Calendar className="w-4 h-4" />
              {formatDate(startDate)} ~ {formatDate(endDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
