declare module '@xenova/transformers' {
  // 1. 결과값인 Tensor의 모양을 정의 (Float32Array 등)
  export class Tensor {
    data: Float32Array;
    dims: number[];
    type: string;
    tolist(): number[[]]; // 배열로 변환하는 유용한 메서드
  }

  // 2. 파이프라인 객체 정의 (함수이자 객체)
  export interface Pipeline {
    // [호출 시그니처] 이 객체는 함수처럼 실행 가능
    (
      text: string | string[],
      options?: {
        pooling?: 'none' | 'mean' | 'cls';
        normalize?: boolean;
        quantize?: boolean;
      }
    ): Promise<Tensor>;

    // (선택사항) 필요하다면 객체 속성도 정의 가능
    // model?: any;
    // tokenizer?: any;
  }

  // pipeline 생성함수 정의
  export function pipeline(
    task: string,
    model?: string,
    options?: {
      quantized?: boolean;
      progress_callback?: (progress: any) => void;
    }
  ): Promise<Pipeline>;
}
