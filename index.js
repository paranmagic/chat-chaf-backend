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

// test 코드
app.get('/test', async (req, res) => {
  try{
    res.json({data:'AI 서비스 개발 강의'});

  }catch(error){

  }
});

// get-읽기, post-추가, update-수정, delete-삭제
app.listen('8080');