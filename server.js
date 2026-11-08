require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, 'data.json');
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:true}));
app.use(session({secret:process.env.SESSION_SECRET || 'development-only-change-me',resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:8*60*60*1000}}));
app.use(express.static(path.join(__dirname,'public')));
function read(){ if(!fs.existsSync(DATA)){ const p=[
 {id:1,name:'Wireless Earbuds',category:'Audio',price:899,stock:12,image:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700',description:'Everyday wireless audio accessory'},
 {id:2,name:'Fast Charger & Cable',category:'Charging',price:499,stock:20,image:'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700',description:'Charging accessory sample listing'},
 {id:3,name:'Smart Watch',category:'Wearables',price:1499,stock:8,image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',description:'Smart wearable sample listing'},
 {id:4,name:'Mobile Back Cover',category:'Accessories',price:199,stock:30,image:'https://images.unsplash.com/photo-1601593346740-925612772716?w=700',description:'Protective mobile cover sample'}]; const d={products:p,orders:[],nextProductId:5,nextOrderId:1}; fs.writeFileSync(DATA,JSON.stringify(d,null,2)); return d;} return JSON.parse(fs.readFileSync(DATA,'utf8')); }
function write(d){fs.writeFileSync(DATA,JSON.stringify(d,null,2));}
function admin(req,res,next){if(req.session.admin) return next(); return res.status(401).json({error:'Please sign in as admin.'});}
app.get('/api/products',(req,res)=>res.json(read().products));
app.post('/api/orders',(req,res)=>{const {customer,phone,address,items,paymentMethod}=req.body||{}; if(!customer||!phone||!address||!Array.isArray(items)||!items.length) return res.status(400).json({error:'Please complete all checkout details.'}); const d=read(); let total=0,clean=[]; for(const item of items){const p=d.products.find(x=>x.id===Number(item.id));const qty=Math.max(1,Math.min(20,Number(item.qty)||1));if(!p||p.stock<qty)return res.status(400).json({error:'A product is unavailable or out of stock.'}); total+=p.price*qty;clean.push({id:p.id,name:p.name,price:p.price,qty});} if(paymentMethod!=='COD'&&paymentMethod!=='ONLINE')return res.status(400).json({error:'Invalid payment method.'}); const order={id:d.nextOrderId++,customer:String(customer).slice(0,100),phone:String(phone).slice(0,30),address:String(address).slice(0,500),items:clean,total,paymentMethod,status:'New',paymentStatus:paymentMethod==='COD'?'Pay on delivery':'Payment pending',createdAt:new Date().toISOString()}; if(paymentMethod==='ONLINE') return res.status(400).json({error:'Online payment is not enabled until Razorpay test/live credentials are configured. Please choose Cash on Delivery for now.'}); clean.forEach(i=>{const p=d.products.find(x=>x.id===i.id);p.stock-=i.qty;}); d.orders.unshift(order);write(d);res.json({ok:true,orderId:order.id});});
app.post('/api/admin/login',async(req,res)=>{const {email,password}=req.body||{};const expectedEmail=process.env.ADMIN_EMAIL||'admin@shivamnetwork.in';const expectedPassword=process.env.ADMIN_PASSWORD||'ChangeThisPassword123!';if(email!==expectedEmail||!await bcrypt.compare(String(password||''),await bcrypt.hash(expectedPassword,10)))return res.status(401).json({error:'Incorrect admin email or password.'});req.session.admin=true;res.json({ok:true});});
app.post('/api/admin/logout',admin,(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get('/api/admin/session',(req,res)=>res.json({loggedIn:!!req.session.admin}));
app.get('/api/admin/orders',admin,(req,res)=>res.json(read().orders));
app.patch('/api/admin/orders/:id',admin,(req,res)=>{const d=read(),o=d.orders.find(x=>x.id===Number(req.params.id));if(!o)return res.status(404).json({error:'Order not found.'});const allowed=['New','Confirmed','Packed','Shipped','Delivered','Cancelled'];if(!allowed.includes(req.body.status))return res.status(400).json({error:'Invalid status.'});o.status=req.body.status;write(d);res.json({ok:true});});
app.post('/api/admin/products',admin,(req,res)=>{const {name,category,price,stock,image,description}=req.body||{};if(!name||!Number.isFinite(Number(price))||Number(price)<0)return res.status(400).json({error:'Product name and valid price are required.'});const d=read();const p={id:d.nextProductId++,name:String(name).slice(0,100),category:String(category||'General').slice(0,60),price:Number(price),stock:Math.max(0,Number(stock)||0),image:String(image||'').slice(0,1000),description:String(description||'').slice(0,500)};d.products.unshift(p);write(d);res.json(p);});
app.put('/api/admin/products/:id',admin,(req,res)=>{const d=read(),p=d.products.find(x=>x.id===Number(req.params.id));if(!p)return res.status(404).json({error:'Product not found.'});for(const k of ['name','category','image','description'])if(req.body[k]!==undefined)p[k]=String(req.body[k]).slice(0,1000);for(const k of ['price','stock'])if(req.body[k]!==undefined)p[k]=Math.max(0,Number(req.body[k])||0);write(d);res.json(p);});
app.delete('/api/admin/products/:id',admin,(req,res)=>{const d=read();d.products=d.products.filter(x=>x.id!==Number(req.params.id));write(d);res.json({ok:true});});
app.get('/api/payment-config',(req,res)=>res.json({onlineEnabled:!!(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET)}));
app.post('/api/payment/create-order',async(req,res)=>{try{if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET)return res.status(400).json({error:'Online payment is not configured.'});const amount=Number(req.body.amount);if(!Number.isFinite(amount)||amount<=0)return res.status(400).json({error:'Invalid amount.'});const rz=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});const order=await rz.orders.create({amount:Math.round(amount*100),currency:'INR',receipt:'shivam_'+Date.now()});res.json({id:order.id,amount:order.amount,currency:order.currency,key:process.env.RAZORPAY_KEY_ID});}catch(e){res.status(500).json({error:'Could not create payment order.'});}});
app.post('/api/payment/verify',(req,res)=>{const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body||{};if(!process.env.RAZORPAY_KEY_SECRET)return res.status(400).json({error:'Online payment is not configured.'});const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+'|'+razorpay_payment_id).digest('hex');if(expected!==razorpay_signature)return res.status(400).json({error:'Payment verification failed.'});res.json({ok:true});});
app.get('/admin',(req,res)=>res.sendFile(path.join(__dirname,'public','admin.html')));
app.listen(PORT,()=>console.log(`Shivam Network running at http://localhost:${PORT}`));
