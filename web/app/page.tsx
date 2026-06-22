import { Badge } from '@krds-ui/core';
import { benefitOptions } from '@/lib/benefits';
import { Onboarding } from '@/components/Onboarding';

// 홈. ① 쉬운 질문으로 내가 해당하는 혜택을 찾고 → ② 끊길 위험까지 점검한다.
export default function Home() {
  const benefits = benefitOptions();

  return (
    <>
      <section className="border-b border-gray-20 bg-primary-5">
        <div className="mx-auto max-w-container px-4 py-7 md:py-14">
          <Badge label="복지 끊김 점검" variant="primary" size="small" />
          <h1 className="mt-2.5 text-heading-m-mobile font-bold leading-tight text-gray-90 md:text-display-s">
            내가 받는 복지, <span className="text-primary-60">끊기기 전에</span> 점검하세요
          </h1>
          <p className="mt-2 max-w-xl text-body-m text-gray-70 md:text-body-l">
            무엇을 받고 있는지 몰라도 괜찮아요. 쉬운 질문 몇 개에 답하면 해당하는 혜택을 찾아주고,
            소득·가구가 바뀔 때 끊길 위험까지 짚어드려요.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-container px-4 py-6 md:py-10">
        <Onboarding benefits={benefits} />
      </section>
    </>
  );
}
