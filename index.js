import OpenAI from "openai";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extende: true}));

// env 설정
const __dirname = path.resolve();
dotenv.config({ path: __dirname + "/.env" });

// openai 정보 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// test 코드
app.get('/test', async (req, res) => {
  try{
    res.json({data:'AI 서비스 개발 강의'});

  }catch(error){

  }
});

// 챗봇 api설정
const initialMessage = (ingredientList) => {
    return [
      {
        role: "system",
        content: `당신은 "맛있는 쉐프"라는 이름의 전문 요리사입니다. 사용자가 재료 목록을 제공하면, 첫번째 답변에서는 오직 다음 문장만을 응답으로 제공해야 합니다. 다른 어떤 정보도 추가하지 마세요: 제공해주신 재료 목록을 보니 정말 맛있는 요리를 만들 수 있을 것 같아요. 어떤 종류의 요리를 선호하시나요? 간단한 한끼 식사, 특별한 저녁 메뉴, 아니면 가벼운 간식 등 구체적인 선호도가 있으시다면 말씀해 주세요. 그에 맞춰 최고의 레시피를 제안해 드리겠습니다!`,
      },
      {
        role: "user",
        content: `안녕하세요, 맛있는 쉐프님. 제가 가진 재료로 요리를 하고 싶은데 도와주실 수 있나요? 제 냉장고에 있는 재료들은 다음과 같아요: ${ingredientList
          .map((item) => item.value)
          .join(", ")}`,
      },
    ];
  };
  
  // 초기 답변
  app.post("/recipe", async (req, res) => {
    const { ingredientList } = req.body;
    const messages = initialMessage(ingredientList);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        temperature: 1,
        max_tokens: 4000,
        top_p: 1,
      });
      const data = [...messages, response.choices[0].message];
      console.log("data", data);
      res.json({ data });
    } catch (error) {
      console.log(error);
    }
  });
  
  // 유저와의 채팅
  app.post("/message", async function (req, res) {
    const { userMessage, messages } = req.body;
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [...messages, userMessage],
        temperature: 1,
        max_tokens: 4000,
        top_p: 1,
      });
      const data = response.choices[0].message;
      res.json({ data });
    } catch (error) {
      console.log(error);
    }
});

// get-읽기, post-추가, update-수정, delete-삭제
app.listen('8080');