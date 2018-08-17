var SerialPort = require("serialport"), //引入模块
    express = require("express"),
    bodyParser=require("body-parser"),
    cookieParser=require('cookie-parser'),
    app = express(),
    setPort=require('./setPort'),
    portName = setPort.setPort.portName, //定义串口名'COM4'
    hostName = '127.0.0.1',
    port = setPort.setPort.port,//
    serialPort = new SerialPort(
        "COM4", {
            baudRate: 9600,  //波特率
            dataBits: 8,    //数据位
            parity: 'none',   //奇偶校验
            stopBits: 1,   //停止位
            flowControl: false,
            autoOpen:false
        }, false);
console.log(setPort)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
let retrunData;
serialPort.open(function(error){
    if(error){
        console.log("打开端口"+portName+"错误："+error.message);
    }else{
        console.log("打开端口成功，正在监听数据中");
        serialPort.on('data',function(data){
            console.log(data.toString())
            retrunData=data.toString().split('+')[1];
            console.log('重量显示:'+ data+"kg");
        })
    }
});
app.post('/cookie', function(req, res) {
    console.log('Cookies: ', req.cookies)
})
app.post("/post",function(req,res){
    console.log()
    retrunData=retrunData.replace('\r\n','');
    retrunData=retrunData.replace(/ /g,'');
    var result = {code:200,msg:retrunData};
    res.send(result);
});

app.listen(port,hostName,function(){

    console.log(`服务器运行在http://${hostName}:${port}`);

});