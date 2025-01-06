// name: 실행 모드 이름
// script: 실행되는 파일
// instances: 프로세스 수
// autorestart: 재시작 on/off
// watch: watch on/off
// env: Node.js 환경변수

// user: 원격 서버에 접근할 사용자 이름을 지정. ex) user: 'ubuntu'
// host: 배포할 원격 서버의 IP 주소나 도메인 이름을 설정, 배열 형식으로 여러 서버를 지정 가능. ex) host: ['192.168.0.1', '192.168.0.2'
// ref: 배포할 Git 브랜치를 지정. ex) ref: 'origin/main'
// repo: 배포할 Git 저장소의 URL을 설정, SSH 주소를 사용하여 원격 서버에서 직접 코드를 가져올 수 있음. ex) repo: 'git@github.com:user/project.git'
// path: 애플리케이션의 배포 경로를 설정, 원격 서버에서 코드가 다운로드될 위치를 지정 ex) path: '/var/www/project'
// pre-deploy-local: 로컬에서 배포 전에 실행할 명령을 지정. ex) 'pre-deploy-local': 'npm run build'
// post-deploy: 서버에서 코드 배포 후 실행할 명령을 설정. ex) 'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'

// pm2 start ecosystem.config.js --env local --watch
module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/apps/api/main.js',
      instances: 3, // 'max',
      exec_mode: 'cluster',
      watch: ['./dist/apps/api/main.js'],
      log_file: './logs/api-out.log', // 통합 로그 파일 경로
      error_file: './logs/api-error.log', // 에러 로그 파일 경로
      out_file: './logs/api-out.log', // 출력 로그 파일 경로
      // merge_logs: true, // 모든 로그를 하나의 파일로 병합
      log_type: 'json',
      env_production: {
        NODE_ENV: 'prod',
      },
      env_development: {
        NODE_ENV: 'dev',
      },
      env_local: {
        NODE_ENV: 'local',
      },
    },
  ],
  // deploy: {
  //   production: {
  //     user: 'SSH_USERNAME',
  //     host: 'SSH_HOSTMACHINE',
  //     ref: 'origin/master',
  //     repo: 'GIT_REPOSITORY',
  //     path: 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy':
  //       'npm install && pm2 reload ecosystem.config.js --env production',
  //   },
  // },
};
