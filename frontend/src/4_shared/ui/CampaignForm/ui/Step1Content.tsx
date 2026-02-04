import { TextField } from '@shared/ui/TextField';
import { TextArea } from '@shared/ui/TextArea';
import { ContentHeader } from './ContentHeader';
import { ImageUpload } from './ImageUpload';
import { KeywordSelector } from './KeywordSelector';
import { AdvancedSettings } from './AdvancedSettings';
import { DateField } from './DateField';
import { useCampaignFormStore } from '../lib/campaignFormStore';
import {
  validateImage,
  validateTitle,
  validateContent,
  validateUrl,
  validateTags,
} from '../lib/step1Validation';
import {
  validateStartDate,
  validateEndDate,
  getToday,
} from '../lib/step2Validation';
import type { Tag } from '../lib/types';

interface Step1ContentProps {
  onImageUpload: (file: File) => Promise<string>;
}

export function Step1Content({ onImageUpload }: Step1ContentProps) {
  const {
    formData,
    updateCampaignContent,
    updateBudgetSettings,
    errors,
    setErrors,
    mode,
  } = useCampaignFormStore();
  const { title, content, url, tags, isHighIntent, image } =
    formData.campaignContent;
  const { startDate, endDate } = formData.budgetSettings;
  const isEditMode = mode === 'edit';

  const today = getToday();
  const isStartDatePassed = startDate < today; // 시작일이 오늘 이전이면 이미 시작된 캠페인!
  const isEndDatePassed = endDate < today; // 종료일이 오늘 이전이면 이미 종료된 캠페인!

  const handleImageChange = (imageUrl: string | null) => {
    updateCampaignContent({ image: imageUrl });
    const error = validateImage(imageUrl);
    setErrors({
      campaignContent: {
        ...errors.campaignContent,
        image: error || undefined,
      },
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCampaignContent({ title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCampaignContent({ content: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCampaignContent({ url: e.target.value });
  };

  const handleTagsChange = (newTags: Tag[]) => {
    updateCampaignContent({ tags: newTags });
    const error = validateTags(newTags);
    setErrors({
      campaignContent: {
        ...errors.campaignContent,
        tags: error || undefined,
      },
    });
  };

  const handleHighIntentChange = (value: boolean) => {
    updateCampaignContent({ isHighIntent: value });
  };

  const handleTitleBlur = () => {
    const error = validateTitle(title);
    setErrors({
      campaignContent: {
        ...errors.campaignContent,
        title: error || undefined,
      },
    });
  };

  const handleContentBlur = () => {
    const error = validateContent(content);
    setErrors({
      campaignContent: {
        ...errors.campaignContent,
        content: error || undefined,
      },
    });
  };

  const handleUrlBlur = () => {
    const error = validateUrl(url);
    setErrors({
      campaignContent: {
        ...errors.campaignContent,
        url: error || undefined,
      },
    });
  };

  const handleStartDateChange = (value: string) => {
    updateBudgetSettings({ startDate: value });
  };

  const handleEndDateChange = (value: string) => {
    updateBudgetSettings({ endDate: value });
  };

  const handleStartDateBlur = () => {
    const error = validateStartDate(startDate, isEditMode);
    setErrors({
      budgetSettings: {
        ...errors.budgetSettings,
        startDate: error || undefined,
      },
    });
  };

  const handleEndDateBlur = () => {
    const error = validateEndDate(startDate, endDate);
    setErrors({
      budgetSettings: {
        ...errors.budgetSettings,
        endDate: error || undefined,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader
        title="광고 내용"
        description="광고에 표시될 이미지와 텍스트를 입력해주세요"
      />
      <ImageUpload
        value={image}
        onChange={handleImageChange}
        validationError={errors.campaignContent?.image}
        onUpload={onImageUpload}
      />
      <TextField
        label="광고 제목"
        placeholder="Next로 배우는 프론트"
        value={title}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        error={errors.campaignContent?.title}
        maxLength={30}
      />
      <TextArea
        label="광고 내용"
        placeholder="Next로 프론트를 배워보고 싶다면 꼭 들어보세요!"
        value={content}
        onChange={handleContentChange}
        onBlur={handleContentBlur}
        error={errors.campaignContent?.content}
        maxLength={100}
      />
      <TextField
        label="광고 URL"
        placeholder="https://myshop.com/macbook"
        value={url}
        onChange={handleUrlChange}
        onBlur={handleUrlBlur}
        error={errors.campaignContent?.url}
      />
      <KeywordSelector
        value={tags}
        onChange={handleTagsChange}
        error={errors.campaignContent?.tags}
      />
      <AdvancedSettings
        isHighIntent={isHighIntent}
        onChange={handleHighIntentChange}
      />

      {isEditMode && (
        <div className="flex flex-col gap-4">
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">기간 설정</h3>
          </div>
          {isEndDatePassed ? (
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              이미 종료된 캠페인은 기간을 수정할 수 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <DateField
                label="시작일"
                value={startDate}
                onChange={handleStartDateChange}
                onBlur={handleStartDateBlur}
                error={errors.budgetSettings?.startDate}
                disabled={isStartDatePassed}
                hint={isStartDatePassed ? '이미 시작된 캠페인' : undefined}
              />
              <DateField
                label="종료일"
                value={endDate}
                onChange={handleEndDateChange}
                onBlur={handleEndDateBlur}
                min={isStartDatePassed ? today : startDate}
                error={errors.budgetSettings?.endDate}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
