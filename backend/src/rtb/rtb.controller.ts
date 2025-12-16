import { Controller, Post, Body } from '@nestjs/common';
import { RTBService } from './rtb.service';
import { DecisionContext } from './types/decision.types';

class DecisionRequestDto {
  sdkId: string;
  postId: string;
  tags: string[];
  postURL: string;
}

@Controller('api/v1/b')
export class RTBController {
  constructor(private readonly rtbService: RTBService) {}

  @Post('decision')
  async getDecision(@Body() body: DecisionRequestDto) {
    const context: DecisionContext = {
      sdkId: body.sdkId,
      postId: body.postId,
      tags: body.tags,
      postURL: body.postURL,
    };

    const result = await this.rtbService.runAuction(context);

    return {
      winner: {
        campaignId: result.winner.id,
        title: result.winner.title,
        image: result.winner.image,
        url: result.winner.url,
        score: result.winner.score,
        matchedTags: result.winner.matchedTags,
      },
      candidates: result.candidates.map((c) => ({
        campaignId: c.id,
        title: c.title,
        score: c.score,
        matchedTags: c.matchedTags,
      })),
    };
  }
}
