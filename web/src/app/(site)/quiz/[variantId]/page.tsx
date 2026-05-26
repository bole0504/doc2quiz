import { QuizExamClient } from "./_components/QuizExamClient";

export default async function VariantPage({
  params,
}: {
  params: { variantId?: string } | Promise<{ variantId?: string }>;
}) {
  const { variantId } = await Promise.resolve(params);
  if (!variantId) return null;
  return <QuizExamClient variantId={variantId} />;
}
