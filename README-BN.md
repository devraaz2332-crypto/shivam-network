# Shivam Network Online Store — সেটআপ নির্দেশিকা

এই প্রজেক্টে আপনার দেওয়া `shivam-banner.png` হোমপেজের প্রধান ব্যানার হিসেবে যুক্ত আছে। এতে কাস্টমার স্টোর, কার্ট, Cash on Delivery checkout এবং Admin Panel আছে।

## চালানোর নিয়ম
1. কম্পিউটারে Node.js 20 বা তার পরের সংস্করণ ইনস্টল করুন।
2. ZIP ফাইল Extract করুন এবং এই ফোল্ডারে Terminal/Command Prompt খুলুন।
3. `npm install` চালান।
4. `.env.example` কপি করে `.env` নাম দিন। `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET` অবশ্যই নিজের শক্তিশালী মান দিয়ে বদলান।
5. `npm start` চালান।
6. ব্রাউজারে `http://localhost:0000` খুলুন। Admin: `http://localhost:0000/admin`।

প্রথমবার চালালে `data.json`-এ নমুনা পণ্য তৈরি হবে। Admin থেকে পণ্য যোগ, দাম/স্টক বদল, ডিলিট এবং অর্ডারের অবস্থা বদলানো যায়। পণ্যের ছবির জন্য HTTPS image URL ব্যবহার করুন।

## গুরুত্বপূর্ণ সীমাবদ্ধতা ও নিরাপত্তা
- এটি চালু করার মতো starter project, কিন্তু production launch-এর আগে পেশাদার security review, HTTPS, স্থায়ী session store, database backup, privacy/return/shipping policy, GST/invoice বিষয় এবং hosting configuration দরকার।
- Online payment এখন ডিফল্টে বন্ধ। Razorpay credentials যোগ করার পরেও live payment চালুর আগে payment flow, order creation ও verification সম্পূর্ণভাবে পরীক্ষা করতে হবে। এই starter-এ verified payment-এর পর order fulfilment workflow সম্পূর্ণ সংযুক্ত নয়; তাই live payment চালু করবেন না যতক্ষণ না সেটি সঠিকভাবে সম্পন্ন ও পরীক্ষা করা হয়।
- Payment merchant account, bank details, KYC এবং live credentials একজন দায়িত্বশীল প্রাপ্তবয়স্কের সাহায্যে বৈধভাবে সেট আপ করতে হবে। Test mode ছাড়া live key ব্যবহার করবেন না। `.env` কখনও কাউকে পাঠাবেন না বা public repository-তে দেবেন না।
- ডিফল্ট admin password ব্যবহার করবেন না। Public hosting-এ দেওয়ার আগে অবশ্যই বদলাবেন।
- `data.json` ফাইলেই demo data এবং order রাখা হয়; এটি ছোট পরীক্ষার জন্য। বাস্তব ব্যবসার জন্য managed database ও নিয়মিত backup ব্যবহার করুন।

দোকানের তথ্য: Shivam Network · Debasis Karmakar · Fulberia, Garbeta · 6294701353
