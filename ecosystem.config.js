module.exports = {
  apps: [
    {
      name: "simrs_api_test",
      script: "app.js",
      cwd: "/home/test-simrsba/backend",
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "/home/test-simrsba/logs/test_api_error.log",
      out_file: "/home/test-simrsba/logs/test_api_out.log"
    },
    {
      name: "simrs_frontend_test",
      script: "npx",
      args: "serve -s . -l 8080",
      exec_mode: "fork", 
      cwd: "/home/test-simrsba/frontend",
      watch: false,
      instances: 1,
      autorestart: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "/home/test-simrsba/logs/test_frontend_error.log",
      out_file: "/home/test-simrsba/logs/test_frontend_out.log"
    }
  ]
};
