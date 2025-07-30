import { AnswerForm } from "@/components/AnswerForm";

const Answer = () => {
  // 실제로는 URL 파라미터에서 질문 정보를 가져옴
  const question = "어머니가 가장 좋아하시는 음식은 무엇인가요?";
  const parentName = "어머니";

  return (
    <AnswerForm 
      question={question}
      parentName={parentName}
    />
  );
};

export default Answer;