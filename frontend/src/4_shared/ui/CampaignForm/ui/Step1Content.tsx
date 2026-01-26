import { TextField } from '@shared/ui/TextField';
import { ContentHeader } from './ContentHeader';
import { ImageUpload } from './ImageUpload';
import { KeywordSelector } from './KeywordSelector';
import { AdvancedSettings } from './AdvancedSettings';
import { useCampaignFormStore } from '../lib/campaignFormStore';
import {
  validateImage,
  validateTitle,
  validateContent,
  validateUrl,
  validateTags,
} from '../lib/step1Validation';
import type { Tag } from '../lib/types';

interface Step1ContentProps {
  onImageUpload: (file: File) => Promise<string>;
}

export function Step1Content({ onImageUpload }: Step1ContentProps) {
  const { formData, updateCampaignContent, errors, setErrors } =
    useCampaignFormStore();
  const { title, content, url, tags, isHighIntent, image } =
    formData.campaignContent;

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

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      />
      <TextField
        label="광고 내용"
        placeholder="Next로 프론트를 배워보고 싶다면 꼭 들어보세요!"
        value={content}
        onChange={handleContentChange}
        onBlur={handleContentBlur}
        error={errors.campaignContent?.content}
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
    </div>
  );
}
