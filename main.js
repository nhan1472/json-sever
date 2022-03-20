const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const userdb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(jsonServer.defaults());
// biến khởi tạo token
const SECRET_KEY = '123456789'
const SECRET_KEY1 = '12345678910'
const expiresIn = '1h'
// luu database
function luu()
{
  fs.writeFile("./db.json", JSON.stringify(userdb), (err, result) => {
    if (err) {
      res.json("không lưu được file")
      return
    }
  })
}

// tao token
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}
function createToken1(payload) {
  return jwt.sign(payload, SECRET_KEY1, { expiresIn })
}
// kiểm tra token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}
function verifyToken1(token) {
  return jwt.verify(token, SECRET_KEY1, (err, decode) => decode !== undefined ? decode : err)
}
// xem danh sach books
server.get('/products', (req, res) => {
    var  a=[];

    for(i=userdb.products.length;i>userdb.products.length-7;i--)
    {
        a.push(userdb.products[i])

    }
    a.splice(0,1)
    res.json(a)
    return 
  })
  server.get('/product', (req, res) => {
    a=[]
    for(i=0;i<=8;i++)
    {
      a.push(userdb.products[i])
    }
    res.jsonp({product:a,
    menu:userdb.menu})
    return 
  })

  server.get('/product/:id', (req, res) => {
    const{id} =req.params
    var page="9"
    a=[]
    b=id*page>userdb.products.length?userdb.products.length:id*page
     pagecuren=Math.ceil(userdb.products.length/page)
      for(i=(id-1)*page;i<b;i++)
      {
        a.push(userdb.products[i])
      }
      if(id>pagecuren)
      {
        res.jsonp()
        return 
      }
        else
        {
          res.jsonp({product:a,
            menu:userdb.menu})
            return 
        }
  })
  server.get('/menu/:id', (req, res) => {
    const{id}=req.params
   
    a=[]
    userdb.products.forEach(e=>{
      if(e.idmenu==id)
      {
        a.push(e)
        
      }
    })
    res.jsonp({data:a,menu:userdb.menu})
    return
  })
  server.get('/products/:id', (req, res) => {
      const{id} =req.params
      a=0
      b=[]
      userdb.binhluan.forEach(e=>{
      if(e.idm==id)
      {
          b.push(e)
      }
    })
      userdb.products.forEach(e => {
        if(e.id==id)
        {
            a=1
            res.jsonp({
                data:e,
                binhluan:b
            })
            return
        }
      });
      if(a==0)
      {
        res.jsonp()
        return
      }
  })
  server.post('/register', (req, res) => {
    {
      const{name,pass,email,daichi} = req.body
      a=0
      userdb.users.forEach(e=>{
        if(e.email==email)
        {
          a=1
          res.jsonp({
            mes:"email bị trùng",
            co:0
          }
          )
          return 
        }
      })
      if(a==0)
    {
      iduser = userdb.users[0]?userdb.users[userdb.users.length - 1].id+1:1
      userdb.users.push({
        id: iduser ,
        name: name,
        email: email,
        pass: pass,
        daichi:daichi
      })
      luu()
      res.jsonp({
        mes: 'Đắng ký thành viên thành công',
        co:1
      })
      return
    }
    }
  })
  server.post('/login', (req, res) => {
    const {email,pass} =req.body
    toke = createToken({ email, pass })
    userdb.users.forEach(e=>{
      if(e.email==email&&e.pass==pass)
      {
        res.jsonp({
          mes: 'Đắng nhập thành công',
          co:1,
          data:e,
          token:toke
        })
        return
      }
      
    })
      res.jsonp({
        mes: 'Đắng nhập sai thông tin tài khoản hoặc mật khẩu',
        co:0
      })
      return
 
    })
    server.get('/login', (req, res) => {
      if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.json(false)
        return 
      }
      try {
        let verifyTokenResult;
         verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);
         if (verifyTokenResult instanceof Error) {
        res.json(false)
           return 
         }
        res.json(true)
         return 
      } catch (err) {
        res.json(false)
        return 
      }
    })
    server.post('/cart', (req, res) => {
      const{id,sl,tt,cart}=req.body
      var today = new Date();
      var date = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+"|"+today.getDate() +"/" +(today.getMonth() + 1) +"/" +today.getFullYear()
      iduser = userdb.hoadon[0]?userdb.hoadon[userdb.hoadon.length - 1].id+1:1
      userdb.hoadon.push({
        id: iduser ,
        idk: id,
        sl: sl,
        tt: tt,
        ngaymua:date,
        cart:cart,
        ttr:0
      })
      luu()
      res.jsonp({
        mes:"thêm thành công"
      })  
      return
    })
    server.post('/hoadon', (req, res) => {
      const{id}=req.body
      a=[]
      userdb.hoadon.forEach(e=>{
        if(e.idk==id)
        {
          a.push(e)
        }
      })  
      res.json(a)
      return
    })
    server.post('/binhluan',(req, res) => {
        const{id,name,idm,noidung} =req.body
        console.log(req.body)
        iduser = userdb.binhluan[0]?userdb.binhluan[userdb.binhluan.length - 1].id+1:1
        userdb.binhluan.push({
          idk:id,
          name:name,
          idm:idm,
          noidung:noidung
        })
          res.json("thêm bình luận thành công")
          return
    })
    server.patch('/sua',(req,res)=>{
      const {id,name,daichi} = req.body
      userdb.users.forEach(e=>{
        if(e.id==id)
        {
          e.name=name
          e.daichi=daichi
        }
      })
      luu()
      res.json("sua thang cong")
      return
    })
    server.post('/loginadmin',(req,res)=>{
      const {email,pass} =req.body
      
      userdb.admin.forEach(e=>{
        if(e.email==email&&e.pass==pass)
        {
          token=createToken1({email,pass})
          res.jsonp({
            mes:"dang nhap thanh cong",
            token:token,
            co:1,
            data:e
          })
          return
        }
      })
      res.json({
        mes:"dang nhap thanh cong",
      })
      return
    }
    )
    server.get('/loginadmin', (req, res) => {
      if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.json(false)
        return 
      }
      try {
        let verifyTokenResult;
         verifyTokenResult = verifyToken1(req.headers.authorization.split(' ')[1]);
         if (verifyTokenResult instanceof Error) {
        res.json(false)
           return 
         }
        res.json(true)
         return 
      } catch (err) {
        res.json(false)
        return 
      }
    })
    server.get('/sanpham', (req, res) => {
      res.jsonp({data:userdb.products,
      menu:userdb.menu})
      return
    })
    server.post('/themsanpham', (req, res) => {
      const{name,img,idmenu,mota,price}= req.body
      iduser = userdb.products[0]?userdb.products[userdb.products.length - 1].id+1:1
      userdb.products.push({
        id:iduser,
        name:name,
        img:img,
        idmenu:idmenu,
        mota:mota,
        price:price,
        sl:1
      })
      luu()
      res.json("them thanh cong");
      return 
    })
    server.delete('/xoasanpham/:id',(req,res)=>{
      const {id} =req.params
      userdb.products.forEach((e,i)=>{
        if(e.id==id)
        {
          userdb.products.splice(i,1)
        }
      })
      luu()
      res.json("xoa thanh cong");
      return 
    })
    server.patch('/suasanpham/:id',(req,res)=>{
      const {id}=req.params
      const{name,img,mota,price} =req.body
      userdb.products.forEach(e=>{
        if(e.id==id)
        {
          e.name=name,
          e.img=img,
          e.mota=mota,
          e.price=price
        }
      })
      luu()
      res.json("sua thanh cong")
      return
    })
    server.patch('/hoadon', (req, res) => {
      const{id,idk} =req.body
      userdb.hoadon.forEach(e=>{
        if(e.id==id&&e.idk==idk)
        {
          e.ttr=2
        }
      })
      luu()
      res.json("huy đơn thành công")
      return
    })
    server.patch('/hoadon1', (req, res) => {
      const{id} =req.body
      userdb.hoadon.forEach(e=>{
        if(e.id==id)
        {
          e.ttr=3 
        }
     
      })
      luu()
      res.json("chuyen sang giao thành công")
      return
    })
    server.patch('/hoadon2', (req, res) => {
      const{id} =req.body
      userdb.hoadon.forEach(e=>{
        if(e.id==id)
        {
          e.ttr=1
        }
      })
      luu()
      res.json("chuyen sang xong thành công")
      return
    })
    server.get('/donhang', (req, res) => {
      a=[]
      for(i=userdb.hoadon.length-1;i>=0;i--)
      {
        a.push(userdb.hoadon[i])
      }
      res.json(a)
      return
    })
    server.get('/thongke',(req,res)=>{
      a=[]
      userdb.users.forEach(e=>{
        sl=0
        tt=0
        userdb.hoadon.forEach(i=>{
          if(i.idk==e.id)
          {
            sl++
            tt+=i.tt
          }
        })
        a.push(
          {
            sl:sl,
            tt:tt,
            kh:e
          }
        )
      })
      res.json(a)
      return
    })
server.use(router)
server.listen(3000, () => {
  console.log('sever dang chay')
})