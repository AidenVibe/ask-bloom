import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

export const useKakaoShare = () => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // 카카오 개발자 센터에서 발급받은 JavaScript 키
      window.Kakao.init('0d86326ffebff95456eaf85ca6b8252e');
      console.log('카카오 SDK 초기화 완료');
    }
  }, []);

  const shareToKakao = (question: string, answerUrl: string, parentName: string) => {
    if (!window.Kakao) {
      console.error('Kakao SDK가 로드되지 않았습니다.');
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: `💌 ${parentName}님께 질문이 도착했어요!\n\n"${question}"\n\n아래 링크를 눌러 답변을 남겨주세요 💕`,
      link: {
        mobileWebUrl: answerUrl,
        webUrl: answerUrl,
      },
      buttons: [
        {
          title: '답변하기',
          link: {
            mobileWebUrl: answerUrl,
            webUrl: answerUrl,
          },
        },
      ],
    });
  };

  const shareFollowUpToKakao = (question: string, parentAnswer: string, childResponse: string, answerUrl: string, parentName: string) => {
    if (!window.Kakao) {
      console.error('Kakao SDK가 로드되지 않았습니다.');
      return;
    }

    // 꼬리답변의 경우 오늘의 대화 페이지로 이동하도록 URL 수정
    console.log('Original answerUrl:', answerUrl);
    
    // URL에서 token 파라미터를 t로 변경하고 conversations 경로로 수정
    const url = new URL(answerUrl);
    const token = url.searchParams.get('token');
    const conversationsUrl = `${url.origin}/conversations?t=${token}`;
    
    console.log('Modified conversationsUrl:', conversationsUrl);

    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: `💕 ${parentName}님의 답변에 꼬리 답변이 도착했어요!\n\n질문: "${question}"\n\n${parentName}님 답변: "${parentAnswer.length > 50 ? parentAnswer.substring(0, 50) + '...' : parentAnswer}"\n\n자녀 꼬리답변: "${childResponse.length > 50 ? childResponse.substring(0, 50) + '...' : childResponse}"\n\n전체 대화를 보시려면 아래 링크를 눌러주세요!`,
      link: {
        mobileWebUrl: conversationsUrl,
        webUrl: conversationsUrl,
      },
      buttons: [
        {
          title: '대화 보기',
          link: {
            mobileWebUrl: conversationsUrl,
            webUrl: conversationsUrl,
          },
        },
      ],
    });
  };

  return { shareToKakao, shareFollowUpToKakao };
};