const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // 필요한 Node 이벤트 추가 가능
    },
    baseUrl: "http://localhost:3000", // 애플리케이션 URL
    supportFile: false, // 필요 시 supportFile 비활성화
  },
});
