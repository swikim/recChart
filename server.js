const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { parseString } = require('xml2js');
require('dotenv').config();
const { End_P } = require('./model/End_P');
const { Land_P }= require('./model/Land_P');
const { Weather_S} = require('./model/Weather_S');
const { SumSsHr } = require('./model/SumSsHr');
const { avgTa } = require('./model/avgTa')

const mongoUrl = process.env.mongoUrl;
const apiKey = process.env.apiKey;
const PORT = process.env.PORT;

app.use(express.json());
//aplication/x-www-from / 분석
app.use(bodyParser.urlencoded({extended: true}));
//application json
app.use(bodyParser.json());
app.use(cors())
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin', 'https://openapi.kpx.or.kr');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})


// Mongoose 연결 설정
mongoose.connect(mongoUrl);


const db = mongoose.connection.useDb('recData');

db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => {
 // console.log('Connected to MongoDB');
  mongoose.connection.useDb('recData');
  // 서버 시작
  app.listen(PORT, () => {
    console.log('http://localhost:8080');
  });
});

// 서버에 사용할 폴더 등록

app.use(express.static(path.join(__dirname, 'client/build')));//Users/gimseung-u/RecChart/client/public/index.html


// React 애플리케이션의 라우터 처리
app.get('/', async (req, res) => {
  try {
    //let result = await db.collection('endP').find().toArray();
    let result = await End_P.find().exec();

    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ err: 'Internal server error' });
  }
});

app.get('/chart', async (req, res) => {
  try {
    //let result = await db.collection('endP').find().toArray();
    let result = await End_P.find().exec();
    res.json({ data: result });
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ err: 'Internal server error' });
  }
});

app.post('/register',async(req,res)=>{

    //const endp = new End_P(req.body)
    const endp = new End_P(req.body.data);

    await endp.save()
        .then(()=>{
            res.status(200).json({
                success : true,
            });
        })
        .catch((err)=>{
            console.error(err);
            res.json({
                success : false,
                err: err,
            });
        });

})

app.post('/api/saveData', async(req,res)=>{
    const endp = new End_P(req.body.data);

    await endp.save()
        .then(()=>{
            res.status(200).json({
                success: true,
            });
        })
        .catch((err)=>{
            console.error(err);
            res.json({
                success :false,
                err:err,
            });
        })
})
app.post('/api/saveData2',async(req,res)=>{
  const landp = new Land_P(req.body.data);
  await landp.save()
    .then(()=>{
      res.status(200).json({
        success:true,
      })
    })
    .catch((err)=>{
      console.error(err);
      res.json({
          success :false,
          err:err,
      });
  })
})
app.get('/search',async(req,res)=>{
  const s_Date_F = req.query.startDate
  const s_Date_T = req.query.endDate
  try{
    let result = await End_P.find({
      date:{
        $gte: s_Date_F,
        $lte: s_Date_T,
      },
    }).exec();
  
    
    res.json({ data : result})

  }catch(error){
    console.error('Error Search Code :', error);
  }
})
app.get('/search_land',async(req,res)=>{
  const start_d = req.query.startDate
  const end_d = req.query.endDate
  try{
    let result = await Land_P.find({
      날짜:{
        $gte: start_d,
        $lte: end_d
      },
    }).exec();
    res.json({data:result})
  }catch(err){
    console.error('error search_land code ',err)
  }
  
})
app.get('/check', async (req, res) => {
  const currentDate = req.query.data;


  try {
    let result = await End_P.findOne({
      date: currentDate,
    }).exec();


    res.json({ data: result });
    
  } catch (err) {
    console.error('Error Check date - server', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/check_land',async(req,res)=>{
  const currentDate=req.query.data;
  try{
    let result = await Land_P.findOne({
      날짜:currentDate,
    }).exec();

    res.json({data:result});

  }catch (err) {
    console.error('Error Check Land - server', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/test',async(req,res)=>{
  try{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    await axios(`https://openapi.kpx.or.kr/openapi/smp1hToday/getSmp1hToday?serviceKey=${apiKey}&areaCd=1`)
      .then(response=>{
        const xmlString = response.data;

        parseString(xmlString, { explicitArray: false }, (err, result) => {
          if (err) {
            console.error('Error parsing XML:   ', err);
          } else {
            // 변환된 JSON 데이터 출력

            res.json(result.response.body.items.item[0])
          }
        });
      })
      .catch(error =>{console.error(error)})
  }
  catch(err){console.error('testing err',err)}
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
