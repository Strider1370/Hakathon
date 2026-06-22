import { Badge } from '@krds-ui/core';
import { benefitOptions } from '@/lib/benefits';
import { CheckForm } from '@/components/CheckForm';

// 끊김 점검 홈. 상황 변동을 고르면 받던 혜택 중 끊길 위험을 코드가 판정해 카드로 보여준다.
export default function Home() {
  const benefits = benefitOptions();

  return (
    <>
      <section className="bg-primary-5">
        <div className="mx-auto max-w-container px-4 py-10 md:py-14">
          <Badge label="복지 끊김 점검" variant="primary" size="small" />
          <h1 className="mt-3 text-heading-l font-bold leading-tight text-gray-90 md:text-display-s">
            받던 복지, <span className="text-primary-60">끊기기 전에</span> 점검하세요
          </h1>
          <p className="mt-3 max-w-xl text-body-l text-gray-70">
            소득·가구 같은 상황이 바뀌면 받던 혜택이 끊기거나 환수될 수 있어요. 달라진 점을
            고르면, 끊길 위험과 지금 해야 할 일을 짚어드립니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-container px-4 py-8 md:py-10">
        <CheckForm benefits={benefits} />
      </section>
    </>
  );
}
