import { TextField } from '@shared/ui/TextField';
import { ContentHeader } from './ContentHeader';
import { ImageUpload } from './ImageUpload';
import { KeywordSelector } from './KeywordSelector';
import { AdvancedSettings } from './AdvancedSettings';
import { useCampaignFormStore } from '../lib/campaignFormStore';
import type { Tag } from '../lib/types';

export function Step1Content() {
  const { formData, updateCampaignContent } = useCampaignFormStore();
  const { title, content, url, tags, isHighIntent, image } =
    formData.campaignContent;

  const handleImageChange = (imageUrl: string | null) => {
    updateCampaignContent({ image: imageUrl });
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
  };

  const handleHighIntentChange = (value: boolean) => {
    updateCampaignContent({ isHighIntent: value });
  };

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader
        title="광고 내용"
        description="광고에 표시될 이미지와 텍스트를 입력해주세요"
      />
      <ImageUpload value={image} onChange={handleImageChange} />
      <TextField
        label="광고 제목"
        placeholder="Next로 배우는 프론트"
        value={title}
        onChange={handleTitleChange}
      />
      <TextField
        label="광고 내용"
        placeholder="Next로 프론트를 배워보고 싶다면 꼭 들어보세요!"
        value={content}
        onChange={handleContentChange}
      />
      <TextField
        label="광고 URL"
        placeholder="https://myshop.com/macbook"
        value={url}
        onChange={handleUrlChange}
      />
      <KeywordSelector value={tags} onChange={handleTagsChange} />
      <AdvancedSettings
        isHighIntent={isHighIntent}
        onChange={handleHighIntentChange}
      />
    </div>
  );
}
