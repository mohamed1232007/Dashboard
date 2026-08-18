require("dotenv").config();
const app = require("./app");

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// تشغيل السيرفر محلياً فقط على جهازك
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// تصدير Express عشان Vercel يعرف يقرأه
module.exports = app;