const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { End_P } = require('./model/End_P');

const mongoUrl = process.env.mongoUrl;

//aplication/x-www-from / 분석
app.use(bodyParser.urlencoded({extended: true}));
//application json
app.use(bodyParser.json());

// Mongoose 연결 설정
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection.useDb('recData');

db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => {
  console.log('Connected to MongoDB');
  mongoose.connection.useDb('recData');
  // 서버 시작
  app.listen(8080, () => {
    console.log('http://localhost:8080');
  });
});

// 서버에 사용할 폴더 등록
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'client/build')));

// React 애플리케이션의 라우터 처리
app.get('/', async (req, res) => {
  try {
    //let result = await db.collection('endP').find().toArray();
    let result = await End_P.find().exec();
    console.log('Data:', result);

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
    console.log('Data:', result);

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
    console.log(endp)
})
app.get('/search',async(req,res)=>{
  const s_Date_F = req.query.startDate
  const s_Date_T = req.query.endDate
  console.log('get date')
  try{
    let result = await End_P.find({
      date:{
        $gte: s_Date_F,
        $lte: s_Date_T,
      },
    }).exec();
  
    console.log('searchData:',result)
    
    res.json({ data : result})

  }catch(error){
    console.error('Error Search Code :', error);
  }
})


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
