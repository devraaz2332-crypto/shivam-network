# Shivam Network — বিনামূল্যে Preview চালু করার নির্দেশিকা

## GitHub-এ আপলোড
1. ZIP Extract করুন।
2. Extract করা `shivam-network-site` ফোল্ডারের **ভেতরের সব ফাইল ও ফোল্ডার** GitHub repository-র root-এ আপলোড করুন। ZIP ফাইল সরাসরি GitHub-এ দেবেন না।
3. নিশ্চিত করুন `render.yaml`, `package.json`, `server.js`, `public/` একই root-এ আছে।

## Render-এ Preview deploy
1. Render.com-এ সাইন ইন করে New → Blueprint নির্বাচন করুন।
2. GitHub-এর `shivam-network` repository connect করুন।
3. Free plan নির্বাচন করে deploy করুন।
4. Render যে `https://....onrender.com` ঠিকানা দেবে সেটিই preview link। Admin পেজ: ওই ঠিকানার শেষে `/admin`।
5. `ADMIN_EMAIL` ও `ADMIN_PASSWORD` ব্যক্তিগতভাবে Render-এর Environment-এ সেট করুন। শক্তিশালী আলাদা পাসওয়ার্ড ব্যবহার করুন; কারও সঙ্গে শেয়ার করবেন না।

## গুরুত্বপূর্ণ সতর্কতা
- Render Free সার্ভিস নিষ্ক্রিয় থাকলে ঘুমিয়ে যেতে পারে; আবার খুলতে প্রায় এক মিনিট লাগতে পারে।
- এই starter `data.json`-এ পণ্য/অর্ডার রাখে। Render Free-তে local file স্থায়ী নয়; restart/redeploy-এ তথ্য হারাতে পারে। তাই এটি শুধু public preview/test-এর জন্য। বাস্তব অর্ডার নেওয়া বা COD চালু করার আগে persistent database, backup, নিরাপত্তা পরীক্ষা ও order workflow সম্পূর্ণ করতে হবে।
- Online payment ডিফল্টে বন্ধ। এখন live payment চালু করবেন না।
- নমুনা পণ্য আছে; আসল পণ্যের নাম, দাম, স্টক ও ছবি পরে বদলাতে হবে।
- KYC, payment, bank বা password তথ্য চ্যাটে দেবেন না। অ্যাকাউন্ট ও পেমেন্ট সেটআপে অভিভাবক/দায়িত্বশীল প্রাপ্তবয়স্কের সাহায্য নিন।
